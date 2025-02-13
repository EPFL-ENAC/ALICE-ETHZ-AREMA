from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import FileItem, Building, BuildingMaterial, BuildingElement, BuildingElementProfessional, BuildingElementMaterial, Professional, BuildingBuildingMaterial, ProfessionalBuilding
from api.models.query import BuildingDraft, BuildingResult, BuildingElementDraft
from api.services.building_elements import BuildingElementService
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime
from api.services.s3 import s3_client
from api.utils.files import moveTempFile
from api.auth import User
from api.services.search import EntityIndexer


class BuildingQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter, fields=None):
        start, end, query = self.build_query(total_count, fields)
        query = self._apply_joins(query, filter)
        if fields is None or len(fields) == 0:
            query = query.options(selectinload(Building.building_materials),
                                  selectinload(Building.building_elements),
                                  selectinload(Building.professionals))
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query


class BuildingService:

    def __init__(self, session: AsyncSession):
        self.session = session
        self.entityType = "building"
        self.folder = f"{self.entityType}s"

    async def indexAll(self) -> int:
        """Index all buildings"""
        indexService = EntityIndexer()
        # delete documents of this type
        indexService.deleteEntities(self.entityType)
        # add all documents
        count = 0
        for entity in (await self.session.exec(select(Building))).all():
            indexService.addEntity(
                self.entityType, entity, self._makeTags(entity), await self._makeRelations(entity))
            count += 1
        debug(f"Indexed {count} buildings")
        return count

    async def count(self) -> int:
        """Count all buildings"""
        count = (await self.session.exec(text("select count(id) from Building"))).scalar()
        return count

    async def get(self, id: int) -> Building:
        """Get a building by id"""
        res = await self.session.exec(
            select(Building).where(
                Building.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building not found")
        return entity

    async def delete(self, id: int) -> Building:
        """Delete a building by id"""
        res = await self.session.exec(
            select(Building)
            .where(Building.id == id)
            .options(selectinload(Building.building_materials),
                     selectinload(Building.building_elements),
                     selectinload(Building.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building not found")
        s3_client.delete_files(f"{self.folder}/{entity.id}")
        entity.building_materials.clear()
        entity.building_elements.clear()
        entity.professionals.clear()
        await self.session.delete(entity)
        await self.session.commit()
        # delete from index
        EntityIndexer().deleteEntity(self.entityType, entity.id)
        return entity

    async def find(self, filter: dict, fields: list, sort: list, range: list) -> BuildingResult:
        """Get all buildings matching filter and range"""
        builder = BuildingQueryBuilder(Building, filter, sort, range, {
                                       "$building_materials": BuildingMaterial, "$building_elements": BuildingElement, "$professionals": Professional})

        # Do a query to satisfy total count
        count_query = builder.build_count_query_with_joins(filter)
        total_count_query = await self.session.exec(count_query)
        total_count = total_count_query.one()

        # Main query
        start, end, query = builder.build_query_with_joins(
            total_count, filter, fields)

        # Execute query
        results = await self.session.exec(query)
        entities = results.all()

        return BuildingResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )

    async def create(self, payload: BuildingDraft, user: User = None) -> Building:
        """Create a new building"""
        entity = Building()
        for key, value in payload.model_dump().items():
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by", "building_material_ids", "building_elements", "professional_ids"]:
                setattr(entity, key, value)
        entity.created_at = datetime.now()
        entity.updated_at = datetime.now()
        if user:
            entity.created_by = user.username
            entity.updated_by = user.username
        # handle relationships
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        new_pros = await self._get_professionals(payload.professional_ids)
        entity.professionals.clear()
        entity.professionals.extend(new_pros)
        self.session.add(entity)
        await self.session.commit()

        # handle tmp files
        if entity.files:
            s3_folder = f"{self.folder}/{entity.id}"
            new_files = []
            for i, item_dict in enumerate(entity.files):
                if "ref" in item_dict:
                    item = await moveTempFile(FileItem(**item_dict), i, s3_folder)
                    new_files.append(item.model_dump())
                elif "url" in item_dict:
                    new_files.append(item_dict)
            entity.files = new_files
            await self.session.commit()

        # handle building elements
        await self._apply_building_elements(entity.id, payload.building_elements)

        # add to index
        EntityIndexer().addEntity(
            self.entityType, entity, self._makeTags(entity), await self._makeRelations(entity))

        return entity

    async def update(self, id: int, payload: BuildingDraft, user: User = None) -> Building:
        """Update a building"""
        res = await self.session.exec(
            select(Building)
            .where(Building.id == id)
            .options(selectinload(Building.building_materials),
                     selectinload(Building.building_elements),
                     selectinload(Building.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building not found")
        for key, value in payload.model_dump().items():
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by", "building_material_ids", "building_elements", "professional_ids"]:
                setattr(entity, key, value)
        entity.updated_at = datetime.now()
        if user:
            entity.updated_by = user.username
        # handle tmp files
        if entity.files:
            s3_folder = f"{self.folder}/{entity.id}"
            new_files = []
            for i, item_dict in enumerate(entity.files):
                if "ref" in item_dict:
                    item = await moveTempFile(FileItem(**item_dict), i, s3_folder)
                    new_files.append(item.model_dump())
                elif "url" in item_dict:
                    new_files.append(item_dict)
            entity.files = new_files
        # handle relationships
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        new_pros = await self._get_professionals(payload.professional_ids)
        entity.professionals.clear()
        entity.professionals.extend(new_pros)
        await self.session.commit()
        # handle building elements
        await self._apply_building_elements(entity.id, payload.building_elements)
        # update in index
        EntityIndexer().updateEntity(
            self.entityType, entity, self._makeTags(entity), await self._makeRelations(entity))
        return entity

    async def _apply_building_elements(self, building_id: int, elements: list[BuildingElementDraft]):
        be_service = BuildingElementService(self.session)
        # look up building elements for this building
        res = await be_service.find({"building_id": building_id}, [], [], [])
        bes = res.data
        updated_ids = [be.id for be in elements if be.id is not None]
        # delete building elements that are not in the new list
        for be in bes:
            if be.id not in updated_ids:
                await be_service.delete(be.id)
        # create/update building elements
        for element in elements:
            element.building_id = building_id
            if element.id is None:
                await be_service.create(element)
            else:
                await be_service.update(element.id, element)

    def _makeTags(self, entity: Building) -> list[str]:
        tags = []
        if entity.type:
            tags.append(entity.type)
        if entity.status:
            tags.append(entity.status)
        if entity.materials:
            tags.extend(entity.materials)
        return tags

    async def _makeRelations(self, entity: Building) -> list[str]:
        # building materials
        relations = (await self.session.exec(select(BuildingBuildingMaterial).where(BuildingBuildingMaterial.building_id == entity.id))).all()
        relates_to = [
            f"building-material:{rel.building_material_id}" for rel in relations]
        # professionals
        relations = (await self.session.exec(select(ProfessionalBuilding).where(ProfessionalBuilding.building_id == entity.id))).all()
        relates_to.extend(
            [f"professional:{rel.professional_id}" for rel in relations])
        # building elements
        relations = (await self.session.exec(select(BuildingElement).where(BuildingElement.building_id == entity.id))).all()
        relates_to.extend(
            [f"technical-construction:{rel.technical_construction_id}" for rel in relations])
        be_ids = [rel.id for rel in relations]
        # building elelement professionals
        for be_id in be_ids:
            relations = (await self.session.exec(select(BuildingElementProfessional).where(BuildingElementProfessional.building_element_id == be_id))).all()
            for rel in relations:
                pid = f"professional:{rel.professional_id}"
                if pid not in relates_to:
                    relates_to.append(pid)
        for be_id in be_ids:
            relations = (await self.session.exec(select(BuildingElementMaterial).where(BuildingElementMaterial.building_element_id == be_id))).all()
            for rel in relations:
                bmid = f"building-material:{rel.building_material_id}"
                if bmid not in relates_to:
                    relates_to.append(bmid)

        return relates_to

    async def _get_building_materials(self, ids: list[int]):
        return await self.session.exec(select(BuildingMaterial).filter(BuildingMaterial.id.in_(ids)))

    async def _get_building_elements(self, ids: list[int]):
        return await self.session.exec(select(BuildingElement)
                                       .filter(BuildingElement.id.in_(ids))
                                       .options(selectinload(BuildingElement.professionals),
                                                selectinload(BuildingElement.technical_construction)))

    async def _get_professionals(self, ids: list[int]):
        return await self.session.exec(select(Professional).filter(Professional.id.in_(ids)))

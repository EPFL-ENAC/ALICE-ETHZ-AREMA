from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import FileItem, Professional, Building, BuildingMaterial, TechnicalConstruction, ProfessionalBuildingMaterial, ProfessionalTechnicalConstruction, ProfessionalBuilding
from api.models.query import ProfessionalDraft, ProfessionalResult
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime
from api.services.s3 import s3_client
from api.utils.files import moveTempFile
from api.auth import User
from api.services.search import EntityIndexer


class ProfessionalQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter, fields=None):
        start, end, query = self.build_query(total_count, fields)
        query = self._apply_joins(query, filter)
        if fields is None or len(fields) == 0:
            query = query.options(selectinload(Professional.building_materials),
                                  selectinload(Professional.technical_constructions))
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query


class ProfessionalService:

    def __init__(self, session: AsyncSession):
        self.session = session
        self.entityType = "professional"
        self.folder = f"{self.entityType}s"

    async def indexAll(self) -> int:
        """Index all professionals"""
        indexService = EntityIndexer()
        # delete documents of this type
        indexService.deleteEntities(self.entityType)
        # add all documents
        count = 0
        for entity in (await self.session.exec(select(Professional))).all():
            indexService.addEntity(
                self.entityType, entity, self._makeTags(entity), await self._makeRelations(entity))
            count += 1
            entity.published_at = datetime.now()
        await self.session.commit()
        debug(f"Indexed {count} professionals")
        return count

    async def count(self) -> int:
        """Count all professionals"""
        count = (await self.session.exec(text("select count(id) from Professional"))).scalar()
        return count

    async def get(self, id: int) -> Professional:
        """Get a professional by id"""
        res = await self.session.exec(
            select(Professional).where(
                Professional.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        return entity

    async def delete(self, id: int) -> Professional:
        """Delete a professional by id"""
        res = await self.session.exec(
            select(Professional)
            .where(Professional.id == id)
            .options(selectinload(Professional.building_materials),
                     selectinload(Professional.technical_constructions)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        s3_client.delete_files(f"{self.folder}/{entity.id}")
        entity.building_materials.clear()
        entity.technical_constructions.clear()
        await self.session.delete(entity)
        await self.session.commit()
        # delete from index
        EntityIndexer().deleteEntity(self.entityType, entity.id)
        return entity

    async def find(self, filter: dict, fields: list, sort: list, range: list) -> ProfessionalResult:
        """Get all professionals matching filter and range"""
        builder = ProfessionalQueryBuilder(Professional, filter, sort, range, {
            "$buildings": Building,
            "$building_materials": BuildingMaterial,
            "$technical_constructions": TechnicalConstruction
        })

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

        return ProfessionalResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )

    async def create(self, payload: ProfessionalDraft, user: User = None) -> Professional:
        """Create a new professional"""
        entity = Professional(**payload.model_dump())
        entity.created_at = datetime.now()
        entity.updated_at = datetime.now()
        if user:
            entity.created_by = user.username
            entity.updated_by = user.username
        # handle relationships
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        new_tcs = await self._get_technical_constructions(payload.technical_construction_ids)
        entity.technical_constructions.clear()
        entity.technical_constructions.extend(new_tcs)
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

        return entity

    async def update(self, id: int, payload: ProfessionalDraft, user: User = None) -> Professional:
        """Update a professional"""
        res = await self.session.exec(
            select(Professional)
            .where(Professional.id == id)
            .options(selectinload(Professional.building_materials),
                     selectinload(Professional.technical_constructions)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        for key, value in payload.model_dump().items():
            debug(key, value)
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by", "published_at", "published_by", "building_material_ids", "technical_construction_ids"]:
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
        new_tcs = await self._get_technical_constructions(payload.technical_construction_ids)
        entity.technical_constructions.clear()
        entity.technical_constructions.extend(new_tcs)
        await self.session.commit()
        return entity

    async def index(self, id: int, user: User = None) -> None:
        """Toggle publication of a professional"""
        res = await self.session.exec(
            select(Professional).where(Professional.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        if not entity.published_at or entity.published_at < entity.updated_at:
            EntityIndexer().updateEntity(
                self.entityType, entity, self._makeTags(entity), await self._makeRelations(entity))
            entity.published_at = datetime.now()
            if user:
                entity.published_by = user.username
        else:
            EntityIndexer().deleteEntity(self.entityType, entity.id)
            entity.published_at = None
            entity.published_by = None
        await self.session.commit()

    def _makeTags(self, entity: Professional) -> list[str]:
        tags = []
        if entity.types:
            tags.extend(entity.types)
        if entity.materials:
            tags.extend(entity.materials)
        return tags

    async def _makeRelations(self, entity: Professional) -> list[str]:
        relations = (await self.session.exec(select(ProfessionalBuildingMaterial).where(ProfessionalBuildingMaterial.professional_id == entity.id))).all()
        relates_to = [
            f"building-material:{rel.building_material_id}" for rel in relations]
        relations = (await self.session.exec(select(ProfessionalTechnicalConstruction).where(ProfessionalTechnicalConstruction.professional_id == entity.id))).all()
        relates_to.extend(
            [f"technical-construction:{rel.technical_construction_id}" for rel in relations])
        relations = (await self.session.exec(select(ProfessionalBuilding).where(ProfessionalBuilding.professional_id == entity.id))).all()
        relates_to.extend([f"building:{rel.building_id}" for rel in relations])
        return relates_to

    async def _get_building_materials(self, ids: list[int]):
        return await self.session.exec(select(BuildingMaterial).filter(BuildingMaterial.id.in_(ids)))

    async def _get_technical_constructions(self, ids: list[int]):
        return await self.session.exec(select(TechnicalConstruction).filter(TechnicalConstruction.id.in_(ids)))

from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import FileItem, Building, BuildingMaterial, TechnicalConstruction, Professional
from api.models.query import BuildingDraft, BuildingResult
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime
from api.services.s3 import s3_client
from api.utils.files import moveTempFile

class BuildingQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter):
        start, end, query = self.build_query(total_count)
        query = self._apply_joins(query, filter)
        query = query.options(selectinload(Building.building_materials),
                              selectinload(Building.technical_constructions),
                              selectinload(Building.professionals))
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query

class BuildingService:
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.folder = "buildings"
    
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
    
    async def delete(self, id: int) -> Building:
        """Delete a building by id"""
        res = await self.session.exec(
            select(Building)
            .where(Building.id == id)
            .options(selectinload(Building.building_materials),
                     selectinload(Building.technical_constructions),
                     selectinload(Building.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building not found")
        s3_client.delete_files(f"{self.folder}/{entity.id}")
        entity.building_materials.clear()
        entity.technical_constructions.clear()
        entity.professionals.clear()
        await self.session.delete(entity)
        await self.session.commit()
        return entity
    
    async def find(self, filter: dict, sort: list, range: list) -> BuildingResult:
        """Get all buildings matching filter and range"""
        builder = BuildingQueryBuilder(Building, filter, sort, range, {"$building_materials": BuildingMaterial, "$technical_constructions": TechnicalConstruction})

        # Do a query to satisfy total count
        count_query = builder.build_count_query_with_joins(filter)
        total_count_query = await self.session.exec(count_query)
        total_count = total_count_query.one()

        # Main query
        start, end, query = builder.build_query_with_joins(total_count, filter)

        # Execute query
        results = await self.session.exec(query)
        entities = results.all()

        return BuildingResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )
    
    async def create(self, payload: BuildingDraft) -> Building:
        """Create a new building"""
        entity = Building(**payload.model_dump())
        entity.created_at = datetime.now()
        entity.updated_at = datetime.now()
        # handle relationships
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        new_tcs = await self._get_technical_constructions(payload.technical_construction_ids)
        entity.technical_constructions.clear()
        entity.technical_constructions.extend(new_tcs)
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
                item = await moveTempFile(FileItem(**item_dict), i, s3_folder)
                new_files.append(item.model_dump())
            entity.files = new_files
            await self.session.commit()
        
        return entity
    
    async def update(self, id: int, payload: BuildingDraft) -> Building:
        """Update a building"""
        res = await self.session.exec(
            select(Building)
            .where(Building.id == id)
            .options(selectinload(Building.building_materials),
                     selectinload(Building.technical_constructions),
                     selectinload(Building.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building not found")
        for key, value in payload.model_dump().items():
            debug(key, value)
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by", "building_material_ids", "technical_construction_ids", "professional_ids"]:
                setattr(entity, key, value)
        entity.updated_at = datetime.now()
        # handle tmp files
        if entity.files:
            s3_folder = f"{self.folder}/{entity.id}"
            new_files = []
            for i, item_dict in enumerate(entity.files):
                item = await moveTempFile(FileItem(**item_dict), i, s3_folder)
                new_files.append(item.model_dump())
            entity.files = new_files
        # handle relationships
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        new_tcs = await self._get_technical_constructions(payload.technical_construction_ids)
        entity.technical_constructions.clear()
        entity.technical_constructions.extend(new_tcs)
        new_pros = await self._get_professionals(payload.professional_ids)
        entity.professionals.clear()
        entity.professionals.extend(new_pros)
        await self.session.commit()
        return entity
    
    async def _get_building_materials(self, ids: list[int]):
        return await self.session.exec(select(BuildingMaterial).filter(BuildingMaterial.id.in_(ids)))
    
    async def _get_technical_constructions(self, ids: list[int]):
        return await self.session.exec(select(TechnicalConstruction).filter(TechnicalConstruction.id.in_(ids)))
    
    async def _get_professionals(self, ids: list[int]):
        return await self.session.exec(select(Professional).filter(Professional.id.in_(ids)))
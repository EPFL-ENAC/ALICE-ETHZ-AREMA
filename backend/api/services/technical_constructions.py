from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import TechnicalConstruction, BuildingMaterial
from api.models.query import TechnicalConstructionResult, TechnicalConstructionDraft
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime

class TechnicalConstructionQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter):
        start, end, query = self.build_query(total_count)
        query = self._apply_joins(query, filter)
        query = query.options(selectinload(TechnicalConstruction.building_materials))
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query

class TechnicalConstructionService:
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def count(self) -> int:
        """Count all technical constructions"""
        count = (await self.session.exec(text("select count(id) from TechnicalConstruction"))).scalar()
        return count
    
    async def get(self, id: int) -> TechnicalConstruction:
        """Get a technical construction by id"""
        res = await self.session.exec(
            select(TechnicalConstruction).where(
                TechnicalConstruction.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Technical construction not found")
    
    async def delete(self, id: int) -> TechnicalConstruction:
        """Delete a technical construction by id"""
        res = await self.session.exec(
            select(TechnicalConstruction).where(TechnicalConstruction.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Technical construction not found")
        await self.session.delete(entity)
        await self.session.commit()
        return entity
    
    async def find(self, filter: dict, sort: list, range: list) -> TechnicalConstructionResult:
        """Get all technical construction matching filter and range"""
        builder = TechnicalConstructionQueryBuilder(TechnicalConstruction, filter, sort, range, {"$building_materials": BuildingMaterial})

        # Do a query to satisfy total count
        count_query = builder.build_count_query_with_joins(filter)
        total_count_query = await self.session.exec(count_query)
        total_count = total_count_query.one()

        # Main query
        start, end, query = builder.build_query_with_joins(total_count, filter)

        # Execute query
        results = await self.session.exec(query)
        entities = results.all()

        return TechnicalConstructionResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )
    
    async def create(self, payload: TechnicalConstructionDraft) -> TechnicalConstruction:
        """Create a new technical construction"""
        entity = TechnicalConstruction(**payload.model_dump())
        entity.created_at = datetime.now()
        entity.updated_at = datetime.now()
        # handle building materials relationship
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        self.session.add(entity)
        await self.session.commit()
        return entity
    
    async def update(self, id: int, payload: TechnicalConstructionDraft) -> TechnicalConstruction:
        """Update a technical construction"""
        res = await self.session.exec(
            select(TechnicalConstruction)
            .where(TechnicalConstruction.id == id)
            .options(selectinload(TechnicalConstruction.building_materials)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Technical construction not found")
        for key, value in payload.model_dump().items():
            debug(key, value)
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by", "building_material_ids"]:
                setattr(entity, key, value)
        # handle building materials relationship
        new_bms = await self._get_building_materials(payload.building_material_ids)
        entity.building_materials.clear()
        entity.building_materials.extend(new_bms)
        entity.updated_at = datetime.now()
        await self.session.commit()
        return entity
    
    async def _get_building_materials(self, ids: list[int]):
        return await self.session.exec(select(BuildingMaterial).filter(BuildingMaterial.id.in_(ids)))
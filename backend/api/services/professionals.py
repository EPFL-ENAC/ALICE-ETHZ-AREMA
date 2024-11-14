from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import Professional, Building, BuildingMaterial, TechnicalConstruction
from api.models.results import ProfessionalResult
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime

class ProfessionalQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter):
        start, end, query = self.build_query(total_count)
        query = self._apply_joins(query, filter)
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query

class ProfessionalService:
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
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
    
    async def delete(self, id: int) -> Professional:
        """Delete a professional by id"""
        res = await self.session.exec(
            select(Professional).where(Professional.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        await self.session.delete(entity)
        await self.session.commit()
        return entity
    
    async def find(self, filter: dict, sort: list, range: list) -> ProfessionalResult:
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
        start, end, query = builder.build_query_with_joins(total_count, filter)

        # Execute query
        results = await self.session.exec(query)
        entities = results.all()

        return ProfessionalResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )
    
    async def create(self, payload: Professional) -> Professional:
        """Create a new professional"""
        payload.created_at = datetime.now()
        payload.updated_at = datetime.now()
        self.session.add(payload)
        await self.session.commit()
        return payload
    
    async def update(self, id: int, payload: Professional) -> Professional:
        """Update a professional"""
        res = await self.session.exec(
            select(Professional).where(Professional.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Professional not found")
        for key, value in payload.model_dump().items():
            print(key, value)
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by"]:
                setattr(entity, key, value)
        entity.updated_at = datetime.now()
        await self.session.commit()
        return entity
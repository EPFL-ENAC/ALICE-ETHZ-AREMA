from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import BuildingElement, BuildingElement, TechnicalConstruction, Building, Professional
from api.models.query import BuildingElementResult, BuildingElementDraft
from enacit4r_sql.utils.query import QueryBuilder


class BuildingElementQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter, fields=None):
        start, end, query = self.build_query(total_count, fields)
        query = self._apply_joins(query, filter)
        if fields is None or len(fields) == 0:
            query = query.options(selectinload(BuildingElement.technical_construction),
                                  selectinload(BuildingElement.building),
                                  selectinload(BuildingElement.professionals))
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query


class BuildingElementService:

    def __init__(self, session: AsyncSession):
        self.session = session
        self.folder = "building-elements"

    async def count(self) -> int:
        """Count all building elements"""
        count = (await self.session.exec(text("select count(id) from BuildingElement"))).scalar()
        return count

    async def get(self, id: int) -> BuildingElement:
        """Get a building element by id"""
        res = await self.session.exec(
            select(BuildingElement).where(
                BuildingElement.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element not found")
        return entity

    async def delete(self, id: int) -> BuildingElement:
        """Delete a building element by id"""
        res = await self.session.exec(
            select(BuildingElement)
            .where(BuildingElement.id == id)
            .options(selectinload(BuildingElement.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element not found")
        entity.professionals.clear()
        await self.session.delete(entity)
        await self.session.commit()
        return entity

    async def find(self, filter: dict, fields: list, sort: list, range: list) -> BuildingElementResult:
        """Get all building elements matching filter and range"""
        builder = BuildingElementQueryBuilder(BuildingElement, filter, sort, range, {
            "$building": Building,
            "$technical_construction": TechnicalConstruction,
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

        return BuildingElementResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )

    async def create(self, payload: BuildingElementDraft) -> BuildingElement:
        """Create a new building element"""
        entity = BuildingElement(**payload.model_dump())
        # handle relationships
        new_pros = await self._get_professionals(payload.professional_ids)
        entity.professionals.clear()
        entity.professionals.extend(new_pros)
        self.session.add(entity)
        await self.session.commit()
        return entity

    async def update(self, id: int, payload: BuildingElementDraft) -> BuildingElement:
        """Update a building element"""
        res = await self.session.exec(
            select(BuildingElement)
            .where(BuildingElement.id == id)
            .options(selectinload(BuildingElement.professionals)))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element not found")
        for key, value in payload.model_dump().items():
            debug(f"{key}: {value}")
            if key not in ["id", "building_id", "technical_construction_id", "professional_ids"]:
                setattr(entity, key, value)
        # handle relationships
        new_pros = await self._get_professionals(payload.professional_ids)
        entity.professionals.clear()
        entity.professionals.extend(new_pros)
        await self.session.commit()
        return entity

    async def _get_professionals(self, ids: list[int]):
        return await self.session.exec(select(Professional).filter(Professional.id.in_(ids)))
from logging import debug
from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import BuildingElementMaterial, BuildingElementMaterial, BuildingElement, BuildingMaterial
from api.models.query import BuildingElementMaterialResult, BuildingElementMaterialDraft
from enacit4r_sql.utils.query import QueryBuilder


class BuildingElementMaterialQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter, fields=None):
        start, end, query = self.build_query(total_count, fields)
        query = self._apply_joins(query, filter)
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query


class BuildingElementMaterialService:

    def __init__(self, session: AsyncSession):
        self.session = session
        self.folder = "building-element-materials"

    async def count(self) -> int:
        """Count all building element materials"""
        count = (await self.session.exec(text("select count(id) from BuildingElementMaterial"))).scalar()
        return count

    async def get(self, id: int) -> BuildingElementMaterial:
        """Get a building element material by id"""
        res = await self.session.exec(
            select(BuildingElementMaterial).where(
                BuildingElementMaterial.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element material not found")
        return entity

    async def delete(self, id: int) -> BuildingElementMaterial:
        """Delete a building element material by id"""
        res = await self.session.exec(
            select(BuildingElementMaterial)
            .where(BuildingElementMaterial.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element material not found")
        await self.session.delete(entity)
        await self.session.commit()
        return entity

    async def find(self, filter: dict, fields: list, sort: list, range: list) -> BuildingElementMaterialResult:
        """Get all building element materials matching filter and range"""
        builder = BuildingElementMaterialQueryBuilder(BuildingElementMaterial, filter, sort, range, {
            "$building_element": BuildingElement,
            "$building_material": BuildingMaterial,
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

        return BuildingElementMaterialResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )

    async def create(self, payload: BuildingElementMaterialDraft) -> BuildingElementMaterial:
        """Create a new building element material"""
        entity = BuildingElementMaterial(**payload.model_dump())
        # handle relationships
        self.session.add(entity)
        await self.session.commit()
        return entity

    async def update(self, id: int, payload: BuildingElementMaterialDraft) -> BuildingElementMaterial:
        """Update a building element material"""
        res = await self.session.exec(
            select(BuildingElementMaterial)
            .where(BuildingElementMaterial.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Building element material not found")
        for key, value in payload.model_dump().items():
            debug(f"{key}: {value}")
            if key not in ["id", "building_element_id", "building_material_id"]:
                setattr(entity, key, value)
        # handle relationships
        await self.session.commit()
        return entity

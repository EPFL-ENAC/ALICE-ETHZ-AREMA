from api.db import AsyncSession
from sqlalchemy.sql import text
from sqlalchemy.orm import selectinload
from sqlmodel import select
from fastapi import HTTPException
from api.models.domain import FileItem, NaturalResource, BuildingMaterial
from api.models.query import NaturalResourceResult
from enacit4r_sql.utils.query import QueryBuilder
from datetime import datetime
from api.services.s3 import s3_client
from api.utils.files import moveTempFile

class NaturalResourceQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_query_with_joins(self, total_count, filter):
        start, end, query = self.build_query(total_count)
        query = self._apply_joins(query, filter)
        #query = query.options(selectinload(NaturalResource.building_materials))
        return start, end, query

    def _apply_joins(self, query, filter):
        # if "$building_materials" in filter:
        #     query = query.join(BuildingMaterial, BuildingMaterial.id == NaturalResource.study_id)
        query = query.distinct()
        return query

class NaturalResourceService:
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.folder = "natural-resources"
    
    async def count(self) -> int:
        """Count all natural resources"""
        count = (await self.session.exec(text("select count(id) from naturalresource"))).scalar()
        return count
    
    async def get(self, id: int) -> NaturalResource:
        """Get a natural resource by id"""
        res = await self.session.exec(
            select(NaturalResource).where(
                NaturalResource.id == id))
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Natural resource not found")
    
    async def delete(self, id: int) -> NaturalResource:
        """Delete a natural resource by id"""
        res = await self.session.exec(
            select(NaturalResource).where(NaturalResource.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Natural resource not found")
        s3_client.delete_files(f"{self.folder}/{entity.id}")
        await self.session.delete(entity)
        await self.session.commit()
        return entity
    
    async def find(self, filter: dict, sort: list, range: list) -> NaturalResourceResult:
        """Get all buildings matching filter and range"""
        builder = NaturalResourceQueryBuilder(NaturalResource, filter, sort, range, {"$building_materials": BuildingMaterial})

        # Do a query to satisfy total count
        count_query = builder.build_count_query_with_joins(filter)
        total_count_query = await self.session.exec(count_query)
        total_count = total_count_query.one()

        # Main query
        start, end, query = builder.build_query_with_joins(total_count, filter)

        # Execute query
        results = await self.session.exec(query)
        entities = results.all()

        return NaturalResourceResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=entities
        )
    
    async def create(self, payload: NaturalResource) -> NaturalResource:
        """Create a new natural resource"""
        entity = NaturalResource(**payload.model_dump())
        entity.created_at = datetime.now()
        entity.updated_at = datetime.now()
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
    
    async def update(self, id: int, payload: NaturalResource) -> NaturalResource:
        """Update a natural resource"""
        res = await self.session.exec(
            select(NaturalResource).where(NaturalResource.id == id)
        )
        entity = res.one_or_none()
        if not entity:
            raise HTTPException(
                status_code=404, detail="Natural resource not found")
        for key, value in payload.model_dump().items():
            print(key, value)
            if key not in ["id", "created_at", "updated_at", "created_by", "updated_by"]:
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
        await self.session.commit()
        return entity
import logging
from api.db import AsyncSession
from sqlmodel import func, select
from api.models.domain import SubjectProfile
from api.models.query import SubjectProfileDraft, SubjectProfileResult
from enacit4r_sql.utils.query import QueryBuilder


class SubjectProfileQueryBuilder(QueryBuilder):

    def build_count_query_with_joins(self, filter):
        query = self.build_count_query()
        query = self._apply_joins(query, filter)
        return query

    def build_group_query_with_joins(self, filter, group_by_column):
        query = self._apply_filter(
            select(group_by_column, func.count(func.distinct(self.model.id))))
        query = self._apply_joins(query, filter)
        return query.group_by(group_by_column)

    def build_query_with_joins(self, total_count, filter, fields=None):
        start, end, query = self.build_query(total_count, fields)
        query = self._apply_joins(query, filter)
        return start, end, query

    def _apply_joins(self, query, filter):
        query = query.distinct()
        return query


class SubjectProfileService:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, subject: str, type: str = "user") -> SubjectProfile:
        """Get subject profile by subject name

        Args:
            subject (str): The unique subject name
            type (str): The type of the subject profile
        Returns:
            SubjectProfile: The subject profile object
        """
        res = await self.session.exec(
            select(SubjectProfile).where(SubjectProfile.name ==
                                         subject, SubjectProfile.type == type)
        )
        return res.first()

    async def get_by_id(self, profile_id: int) -> SubjectProfile:
        """Get subject profile by ID

        Args:
            profile_id (int): The unique subject profile ID
        Returns:
            SubjectProfile: The subject profile object
        """
        res = await self.session.exec(
            select(SubjectProfile).where(SubjectProfile.id == profile_id)
        )
        return res.first()

    async def create(self, payload: SubjectProfileDraft) -> SubjectProfile:
        """Create a new subject profile

        Args:
            profile (SubjectProfileDraft): The subject profile object to create

        Returns:
            SubjectProfile: The created subject profile object
        """
        profile_obj = SubjectProfile(**payload.model_dump())
        self.session.add(profile_obj)
        await self.session.commit()
        await self.session.refresh(profile_obj)
        return profile_obj

    async def update(self, id: int, payload: SubjectProfileDraft) -> SubjectProfile:
        """Update an existing subject profile

        Args:
            payload (SubjectProfileDraft): The subject profile data to update
        Returns:
            SubjectProfile: The updated subject profile object
        """
        profile = await self.get_by_id(id)
        if not profile:
            return None

        for key, value in payload.model_dump().items():
            if key not in ["id"]:
                setattr(profile, key, value)

        self.session.add(profile)
        await self.session.commit()
        await self.session.refresh(profile)
        return profile

    async def delete(self, name: str, type: str = "user") -> bool:
        """Delete a subject profile

        Args:
            name (str): The subject name
            type (str): The type of the subject profile
        Returns:
            bool: True if deleted, False otherwise
        """
        profile = await self.get(name, type)
        if not profile:
            return False

        await self.session.delete(profile)
        await self.session.commit()
        return True

    async def delete_by_id(self, profile_id: int) -> bool:
        """Delete a subject profile by ID

        Args:
            profile_id (int): The unique subject profile ID
        Returns:
            bool: True if deleted, False otherwise
        """
        profile = await self.get_by_id(profile_id)
        if not profile:
            return False

        await self.session.delete(profile)
        await self.session.commit()
        return True

    async def count(self) -> int:
        """Count total subject profiles

        Returns:
            int: Total number of subject profiles
        """
        res = await self.session.exec(
            select(func.count(SubjectProfile.id))
        )
        return res.one()

    async def count_by_type(self, type: str) -> int:
        """Count subject profiles by type

        Args:
            type (str): The type of the subject profiles
        Returns:
            int: Total number of subject profiles of the given type
        """
        res = await self.session.exec(
            select(func.count(SubjectProfile.id)).where(
                SubjectProfile.type == type)
        )
        return res.one()

    async def find(self, filter: dict, fields: list, sort: list, range: list) -> SubjectProfileResult:
        """Get all subject profiles matching filter and range"""
        builder = SubjectProfileQueryBuilder(
            SubjectProfile, filter, sort, range, {})

        # Do a query to satisfy total count
        count_query = builder.build_count_query_with_joins(filter)
        total_count_query = await self.session.exec(count_query)
        total_count = total_count_query.one()

        # Do the actual query to get data
        start, end, query = builder.build_query_with_joins(
            total_count, filter, fields)
        data_query = await self.session.exec(query)
        data = data_query.all()

        return SubjectProfileResult(
            total=total_count,
            skip=start,
            limit=end - start + 1,
            data=data
        )

from pydantic import BaseModel
from typing import List, Optional


class IGLehmImage(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    url: str


class IGLehmEntity(BaseModel):
    cId: int
    title: str


class IGLehmProjectSummary(IGLehmEntity):
    pageUrl: str
    previewImage: Optional[str] = None
    building_id: Optional[int] = None


class IGLehmProject(IGLehmEntity):
    pageUrl: str
    content: Optional[str] = None
    description: Optional[str] = None
    previewImage: Optional[str] = None
    location: Optional[str] = None
    yearOfConstruction: Optional[str] = None
    regions: Optional[List[str]] = None
    fields: Optional[List[str]] = None
    images: Optional[List[IGLehmImage]] = None
    building_id: Optional[int] = None


class IGLehmSpecialistSummary(IGLehmEntity):
    pageUrl: str
    professional_id: Optional[int] = None


class IGLehmSpecialist(IGLehmEntity):
    pageUrl: str
    description: Optional[str] = None
    address: Optional[str] = None
    contactPerson: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    branchLocation: Optional[str] = None
    brancCantons: Optional[str] = None
    sectors: Optional[List[str]] = None
    specialityFields: Optional[List[str]] = None
    images: Optional[List[IGLehmImage]] = None
    projects: Optional[List[IGLehmEntity]] = None
    professional_id: Optional[int] = None
    building_ids: Optional[List[int]] = None

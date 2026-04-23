from pydantic import BaseModel
from typing import List, Optional


class IGLehmImage(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    url: str


class IGLehmProjectSummary(BaseModel):
    cId: int
    pageUrl: str
    title: str
    previewImage: Optional[str] = None


class IGLehmProject(BaseModel):
    cId: int
    pageUrl: str
    title: str
    content: Optional[str] = None
    description: Optional[str] = None
    previewImage: Optional[str] = None
    location: Optional[str] = None
    yearOfConstruction: Optional[str] = None
    regions: Optional[List[str]] = None
    fields: Optional[List[str]] = None
    images: Optional[List[IGLehmImage]] = None

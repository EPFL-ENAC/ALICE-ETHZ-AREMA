from pydantic import BaseModel


class IGLehmImage(BaseModel):
    id: int
    title: str | None = None
    description: str | None = None
    url: str


class IGLehmEntity(BaseModel):
    cId: int
    title: str


class IGLehmProjectSummary(IGLehmEntity):
    pageUrl: str
    previewImage: str | None = None
    building_id: int | None = None


class IGLehmProject(IGLehmEntity):
    pageUrl: str
    content: str | None = None
    description: str | None = None
    previewImage: str | None = None
    location: str | None = None
    yearOfConstruction: str | None = None
    regions: list[str] | None = None
    fields: list[str] | None = None
    images: list[IGLehmImage] | None = None
    building_id: int | None = None


class IGLehmSpecialistSummary(IGLehmEntity):
    pageUrl: str
    professional_id: int | None = None


class IGLehmSpecialist(IGLehmEntity):
    pageUrl: str
    description: str | None = None
    address: str | None = None
    contactPerson: str | None = None
    phone: str | None = None
    mobile: str | None = None
    fax: str | None = None
    email: str | None = None
    website: str | None = None
    branchLocation: str | None = None
    brancCantons: str | None = None
    sectors: list[str] | None = None
    specialityFields: list[str] | None = None
    images: list[IGLehmImage] | None = None
    projects: list[IGLehmEntity] | None = None
    professional_id: int | None = None
    building_ids: list[int] | None = None

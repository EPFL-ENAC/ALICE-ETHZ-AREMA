from sqlmodel import Field, SQLModel

# Authorization models


class ACL(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    resource: str
    subject_type: str = Field(default="user")
    subject: str
    permission: str  # e.g., "read", "write", "delete"

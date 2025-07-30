from sqlmodel import SQLModel, Field
from typing import Optional

# Authorization models


class ACL(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resource: str
    subject_type: str = Field(default="user")
    subject: str
    permission: str  # e.g., "read", "write", "delete"

from datetime import datetime
from sqlmodel import SQLModel, Field

class ProjectBase(SQLModel):
    name: str = Field(min_length=3, max_length=50, index=True)
    description: str | None = Field(default=None, max_length=255)

class ProjectCreate(ProjectBase):
    pass

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    owner_id: int
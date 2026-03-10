from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from sqlalchemy import Column, DateTime, func

from ..schemas import ProjectBase

if TYPE_CHECKING:
    from app.models.user import User

class Project(ProjectBase, table=True):
    __tablename__ = "projects"

    id: int | None = Field(default=None, primary_key=True)
    
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(), 
            nullable=False
        )
    )
    
    owner_id: int = Field(foreign_key="users.id", nullable=False, ondelete="CASCADE")
    owner: "User" = Relationship(back_populates="projects")

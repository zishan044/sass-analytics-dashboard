from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy import Column, DateTime, func
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from app.models.project import Project

class Event(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    event_type: str = Field(index=True)
    value: float = Field(default=0.0)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(), 
            nullable=False
        )
    )
    
    project_id: int = Field(foreign_key="projects.id")
    project: "Project" = Relationship(back_populates="events")
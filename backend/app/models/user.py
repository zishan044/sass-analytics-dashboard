from sqlmodel import Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Column, DateTime, func

from ..schemas import UserBase

if TYPE_CHECKING:
    from app.models.project import Project

class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), 
            server_default=func.now(), 
            nullable=False
        )
    )

    projects: list["Project"] = Relationship(back_populates='owner')
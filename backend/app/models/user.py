from sqlmodel import Field
from datetime import datetime
from sqlalchemy import Column, DateTime, func

from ..schemas import UserBase

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
from pydantic import EmailStr
from sqlmodel import SQLModel, Field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.project import ProjectRead

class UserBase(SQLModel):
    username: str = Field(min_length=4, max_length=50)
    email: EmailStr = Field(unique=True, index=True) 

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserRead(UserBase):
    id: int
    projects: list["ProjectRead"]

class UserLogin(SQLModel):
    email: EmailStr
    password: str

from app.schemas.project import ProjectRead

UserRead.model_rebuild()
from pydantic import EmailStr
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    username: str = Field(min_length=4, max_length=50)
    email: EmailStr = Field(unique=True, index=True) 

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserRead(UserBase):
    id: int

class UserLogin(SQLModel):
    email: EmailStr
    password: str
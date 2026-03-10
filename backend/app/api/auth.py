from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from ..models import User, Project
from ..schemas import UserCreate, UserLogin, UserRead
from ..core import get_session, get_current_user
from ..services import register_user, login_user

auth_router = APIRouter(prefix='/auth', tags=['auth'])

@auth_router.post('/register', status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    try:
        await register_user(session, user_in)
        return {"message": "User registered successfully"}
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))

@auth_router.post('/login')
async def login(
    credentials: UserLogin,
    response: Response,
    session: AsyncSession = Depends(get_session),
):
    access_token = await login_user(session, credentials)

    if not access_token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        expires=3600,
        samesite='lax',
        secure=False,
    )
    
    return {"message": "Login successful"}

@auth_router.get("/me", response_model=UserRead)
async def read_users_me(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(User).where(User.id == current_user.id).options(selectinload(User.projects))
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    return user

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"detail": "Successfully logged out"}
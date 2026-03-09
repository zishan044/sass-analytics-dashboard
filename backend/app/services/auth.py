from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy.exc import IntegrityError

from ..schemas import UserCreate, UserLogin
from ..core import get_password_hash, verify_password, create_access_token
from ..models import User


async def register_user(session: AsyncSession, user_in: UserCreate):
    email = user_in.email.strip().lower()
    hashed_password = get_password_hash(user_in.password)

    user = User(
        username=user_in.username,
        email=email,
        hashed_password=hashed_password
    )

    try:
        session.add(user)
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        raise e

    await session.refresh(user)
    return user

async def authenticate_user(session: AsyncSession, credentials: UserLogin):
    email = credentials.email.strip().lower()

    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        return None
    
    if not verify_password(credentials.password, user.hashed_password):
        return None
    
    return user

async def login_user(session: AsyncSession, credentials: UserLogin):
    user = await authenticate_user(session, credentials)

    if not user:
        return None
    
    access_token = create_access_token({"sub": str(user.id)})

    return access_token
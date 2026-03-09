from fastapi import Request, HTTPException, status, Depends
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from .jwt import decode_access_token
from .database import get_session
from ..models import User

def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not authenticated"
        )
    return token

async def get_current_user(
    token: str = Depends(get_token_from_cookie),
    session: AsyncSession = Depends(get_session)
) -> User:
    payload = decode_access_token(token)
    
    user_id = payload.get("sub")

    statement = select(User).where(User.id == int(user_id))
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    return user
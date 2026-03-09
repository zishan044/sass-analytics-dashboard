from fastapi import HTTPException, status, Request
from datetime import datetime, timedelta, timezone
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError

from .config import settings

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()

    if not expires_delta:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    time_expires = datetime.now(timezone.utc) + expires_delta

    to_encode.update({"exp": time_expires})

    return encode(data, settings.SECRET_KEY, settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        if "sub" not in payload:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid payload")
        
        return payload
    
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
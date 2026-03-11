from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..core import get_session, get_current_user
from ..models import Event, Project, User
from ..schemas import EventCreateBulk

event_router = APIRouter(prefix='/events', tags=['events'])

@event_router.post('/', status_code=status.HTTP_201_CREATED)
async def ingest_events(
    events_payload: EventCreateBulk,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Project).where(
        Project.id == events_payload.project_id,
        Project.owner_id == current_user.id
    )
    result = await session.execute(stmt)
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {events_payload.project_id} not found"
        )
    
    db_events = [
        Event(
            **event.model_dump(),
            project_id=events_payload.project_id
        )
        for event in events_payload.events
    ]
    
    try:
        session.add_all(db_events) 
        await session.commit()
        
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch ingestion failed. Ensure values are numeric and types are valid."
        )
    
    return {
        "message": f"Successfully ingested {len(db_events)} events",
        "project_id": events_payload.project_id
    }
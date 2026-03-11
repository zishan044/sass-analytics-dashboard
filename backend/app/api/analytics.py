from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, literal_column

from ..core import get_current_user, get_session
from ..models import User, Project, Event

analytics_router = APIRouter(prefix='/analytics', tags=['analytics'])

from datetime import datetime
from fastapi import Depends, HTTPException, status
from sqlalchemy import func, text
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

@analytics_router.get("/{project_id}")
async def get_project_analytics(
    project_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):

    project_stmt = select(Project).where(
        Project.id == project_id,
        Project.owner_id == current_user.id
    )
    project_result = await session.execute(project_stmt)
    project = project_result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or you do not have access."
        )

    day_series = func.generate_series(
        func.date_trunc("day", func.min(Event.created_at)),
        func.date_trunc("day", func.max(Event.created_at)),
        literal_column("interval '1 day'")
    ).label("day")

    date_series_subq = (
        select(day_series)
        .where(Event.project_id == project_id)
    ).subquery()

    stats_stmt = (
        select(
            date_series_subq.c.day,
            func.count(Event.id).label("total_events"),
            func.coalesce(func.sum(Event.value), 0).label("revenue"),
        )
        .select_from(date_series_subq)
        .join(
            Event,
            func.date_trunc("day", Event.created_at) == date_series_subq.c.day,
            isouter=True,
        )
        .where(Event.project_id == project_id)
        .group_by(date_series_subq.c.day)
        .order_by(date_series_subq.c.day)
    )
    result = await session.execute(stats_stmt, {"project_id": project_id})
    rows = result.all()

    data = [
        {
            "date": row.day.isoformat(),
            "events": row.total_events,
            "revenue": row.revenue
        }
        for row in rows
    ]

    return {"data": data}
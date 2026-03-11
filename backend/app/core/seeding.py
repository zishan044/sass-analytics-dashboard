import asyncio
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models import Project, Event
from ..core import engine

EVENT_TYPES = ["page_view", "click", "signup", "purchase"]

async def seed_events(project_id: int, session: AsyncSession):
        
    for _ in range(150):
        random_days = random.randint(0, 30)
        random_hours = random.randint(0, 23)
        timestamp = datetime.now(timezone.utc) - timedelta(days=random_days, hours=random_hours)
        
        event_type = random.choice(EVENT_TYPES)
        
        value = random.uniform(10.0, 100.0) if event_type == "purchase" else 1.0
        
        event = Event(
            project_id=project_id,
            event_type=event_type,
            value=round(value, 2),
            created_at=timestamp
        )
        session.add(event)
    
    await session.commit()

async def seed_all_projects():
    async with AsyncSession(engine) as session:
        result = await session.execute(select(Project.id))
        project_ids = result.scalars().all()
        
        if not project_ids:
            return

        for p_id in project_ids:
            await seed_events(project_id=p_id, session=session)
        
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed_all_projects())
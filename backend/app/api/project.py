from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List

from ..core import get_session 
from ..models import User, Project
from ..schemas import ProjectCreate, ProjectRead
from ..core import get_current_user

project_router = APIRouter(prefix='/projects', tags=['projects'])

@project_router.post('/', response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_project = Project(
        **project_in.model_dump(),
        owner_id=current_user.id
    )
    session.add(db_project)

    try:
        await session.commit()
        await session.refresh(db_project)
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Could not create project. Ensure the name is unique."
        )
    
    return db_project

@project_router.get('/', response_model=List[ProjectRead])
async def get_projects(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Project).where(Project.owner_id == current_user.id)
    result = await session.execute(statement)
    projects = result.scalars().all()

    return projects
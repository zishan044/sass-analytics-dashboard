from fastapi import APIRouter, status, Depends
from celery.result import AsyncResult
from ..tasks.generate_report import generate_project_report
from ..core.celery import celery_app
from ..models import User
from ..core import get_current_user

reports_router = APIRouter(prefix="/reports", tags=["reports"])

@reports_router.post("/generate/{project_id}", status_code=status.HTTP_202_ACCEPTED)
async def trigger_report(
    project_id: int, 
    current_user: User = Depends(get_current_user)
):
    task = generate_project_report.delay(project_id)
    
    return {
        "task_id": task.id,
        "message": "Report generation started"
    }

@reports_router.get("/status/{task_id}")
async def get_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    
    result = {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }
    
    return result
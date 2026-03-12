from celery import Celery

from .config import settings

celery_app = Celery(
    "saas_analytics_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.generate_report"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)

if __name__ == "__main__":
    celery_app.start()
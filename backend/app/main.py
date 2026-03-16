from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core import init_db, engine
from .api import auth_router, project_router, analytics_router, event_router, reports_router, billing_router, websocket_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("starting...")
    yield
    await engine.dispose()
    print("shutting down...")
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(analytics_router)
app.include_router(event_router)
app.include_router(reports_router)
app.include_router(billing_router)
app.include_router(websocket_router)

@app.get('/health')
def health_check():
    return {'status': 'ok'}
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends

from ..core import get_current_user, manager

router = APIRouter()

@router.websocket("/ws/{project_id}")
async def project_websocket_endpoint(
    websocket: WebSocket, 
    project_id: str,
    user_id: str = Depends(get_current_user)
):
    await manager.connect(websocket, project_id)
    try:
        while True:
            data = await websocket.receive_text()    
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
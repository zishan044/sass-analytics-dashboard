from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status

from ..core import manager

websocket_router = APIRouter()

@websocket_router.websocket("/ws/{project_id}")
async def project_websocket_endpoint(
    websocket: WebSocket, 
    project_id: str,
):
    await websocket.accept()
    
    try:
        token = websocket.cookies.get("access_token")
        if not token:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        manager.connect(websocket, project_id)
        
        while True:
            await websocket.receive_text()
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, project_id)
    except Exception as e:
        print(f"WS Error: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
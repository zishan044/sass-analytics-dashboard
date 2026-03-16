from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        self.active_connections: defaultdict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, project_id: str):
        self.active_connections[project_id].append(websocket)

    def disconnect(self, websocket: WebSocket, project_id: str):
        connections = self.active_connections.get(project_id)

        if connections:
            connections.remove(websocket)

            # Clean up if no connections remain
            if not connections:
                del self.active_connections[project_id]

    async def broadcast(self, message: dict, project_id: str):
        """Send JSON message to all connected clients for a project."""
        for connection in self.active_connections.get(project_id, []):
            await connection.send_json(message)

# Global manager instance
manager = ConnectionManager()
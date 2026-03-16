import { useEffect, useState, useRef, useCallback } from "react";
import { getWsUrl, WebSocketMessage } from "@/lib/api"; // Import from your new api.ts helpers

interface WebSocketOptions {
  onMessage?: (data: WebSocketMessage) => void; // Use the type from api.ts
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebsocket = (
  projectId: number,
  options: WebSocketOptions = {},
) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const connectFnRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (!projectId) return;

    const socket = new WebSocket(getWsUrl(projectId));

    socket.onopen = () => {
      setIsConnected(true);
      reconnectCountRef.current = 0;
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        options.onMessage?.(data);
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      const maxAttempts = options.reconnectAttempts || 5;
      if (reconnectCountRef.current < maxAttempts) {
        setTimeout(() => {
          reconnectCountRef.current++;
          connectFnRef.current?.();
        }, options.reconnectInterval || 3000);
      }
    };

    socketRef.current = socket;
  }, [projectId, options]);

  useEffect(() => {
    connectFnRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);

  return { isConnected };
};

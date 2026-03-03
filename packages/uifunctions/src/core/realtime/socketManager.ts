import { io, type Socket } from "socket.io-client";

const connections = new Map<string, Socket>();

export function getOrCreateSocket(
  serviceUrl: string,
  getToken: () => string | undefined,
): Socket {
  const existing = connections.get(serviceUrl);
  if (existing?.connected) {
    return existing;
  }

  if (existing) {
    existing.disconnect();
    connections.delete(serviceUrl);
  }

  const token = getToken();
  const socket = io(serviceUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  socket.on("connect_error", (err) => {
    console.warn(`[RealtimeSync] Connection error for ${serviceUrl}:`, err.message);
  });

  connections.set(serviceUrl, socket);
  return socket;
}

export function removeSocket(serviceUrl: string): void {
  const socket = connections.get(serviceUrl);
  if (socket) {
    socket.disconnect();
    connections.delete(serviceUrl);
  }
}

export function disconnectAll(): void {
  connections.forEach((socket) => socket.disconnect());
  connections.clear();
}

export function getActiveConnectionCount(): number {
  return connections.size;
}

import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { getOrCreateSocket } from "./socketManager";
import { useRealtimeContext } from "./RealtimeProvider";
import type { DomainEvent, UseRealtimeSyncOptions } from "./types";

const DATA_CHANGED_EVENT = "data-changed";

export function useRealtimeSync(options: UseRealtimeSyncOptions): { connected: boolean } {
  const { entity, entityId, onEvent, serviceUrl, enabled = true } = options;
  const { getToken, defaultServiceUrl } = useRealtimeContext();
  const [connected, setConnected] = useState(false);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const resolvedUrl = serviceUrl ?? defaultServiceUrl;

  useEffect(() => {
    if (!enabled || !resolvedUrl) {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    const socket: Socket = getOrCreateSocket(resolvedUrl, getToken);
    const room = entityId ? `entity:${entity}:${entityId}` : `entity:${entity}`;

    socket.emit("subscribe", { room });

    const handleDataChanged = (event: DomainEvent) => {
      if (event.entity === entity) {
        onEventRef.current(event);
      }
    };

    socket.on(DATA_CHANGED_EVENT, handleDataChanged);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.emit("unsubscribe", { room });
      socket.off(DATA_CHANGED_EVENT, handleDataChanged);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [entity, entityId, enabled, resolvedUrl, getToken]);

  return { connected };
}

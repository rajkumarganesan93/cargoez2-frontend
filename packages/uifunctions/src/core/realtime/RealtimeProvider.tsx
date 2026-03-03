import { createContext, useContext, useEffect, useRef } from "react";
import type React from "react";
import { disconnectAll } from "./socketManager";

interface RealtimeContextValue {
  getToken: () => string | undefined;
  defaultServiceUrl: string | undefined;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  getToken: () => undefined,
  defaultServiceUrl: undefined,
});

export interface RealtimeProviderProps {
  getToken: () => string | undefined;
  defaultServiceUrl?: string;
  children: React.ReactNode;
}

export function RealtimeProvider({
  getToken,
  defaultServiceUrl,
  children,
}: RealtimeProviderProps) {
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    return () => {
      disconnectAll();
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{ getToken: () => getTokenRef.current(), defaultServiceUrl }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext(): RealtimeContextValue {
  return useContext(RealtimeContext);
}

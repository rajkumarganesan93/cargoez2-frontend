export interface DomainEvent {
  entity: string;
  action: "created" | "updated" | "deleted";
  entityId: string;
  data?: Record<string, unknown>;
  actor: string;
  tenantId?: string;
  timestamp: string;
}

export interface UseRealtimeSyncOptions {
  entity: string;
  entityId?: string;
  onEvent: (event: DomainEvent) => void;
  serviceUrl?: string;
  enabled?: boolean;
}

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import { useRealtimeSync } from "@rajkumarganesan93/uifunctions";
import type { ApiError, DomainEvent } from "@rajkumarganesan93/uifunctions";
import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../../domain";
import { freightUseCases } from "../../di/container";

const sampleShipments: Shipment[] = [
  { id: "1", origin: "Los Angeles, CA", destination: "New York, NY", status: "In Transit", weight: "250 kg", carrier: "FedEx", estimatedDelivery: "2026-03-05T10:00:00Z" },
  { id: "2", origin: "Chicago, IL", destination: "Houston, TX", status: "Pending", weight: "180 kg", carrier: "UPS", estimatedDelivery: "2026-03-08T14:00:00Z" },
  { id: "3", origin: "Seattle, WA", destination: "Miami, FL", status: "Delivered", weight: "320 kg", carrier: "DHL", estimatedDelivery: "2026-02-25T09:00:00Z" },
  { id: "4", origin: "Denver, CO", destination: "Phoenix, AZ", status: "Cancelled", weight: "95 kg", carrier: "USPS", estimatedDelivery: "2026-03-01T12:00:00Z" },
];

export function useFreightList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await freightUseCases.listShipments();
      setShipments(data);
    } catch {
      setShipments(sampleShipments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleRealtimeEvent = useCallback(
    (event: DomainEvent) => {
      fetchShipments();
      showToast("info", `A shipment was ${event.action} by another user`);
    },
    [fetchShipments, showToast],
  );

  const { connected } = useRealtimeSync({
    entity: "freight",
    onEvent: handleRealtimeEvent,
  });

  return { shipments, loading, refetch: fetchShipments, connected };
}

export function useFreightDetail(id: string | undefined) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    freightUseCases
      .getShipment(id)
      .then((data) => setShipment(data))
      .catch(() =>
        setShipment(sampleShipments.find((s) => s.id === id) ?? sampleShipments[0])
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { shipment, loading };
}

export function useFreightMutation() {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const createShipment = async (data: CreateShipmentInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await freightUseCases.createShipment(data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateShipment = async (id: string, data: UpdateShipmentInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await freightUseCases.updateShipment(id, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createShipment, updateShipment };
}

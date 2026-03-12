import { useState, useEffect, useCallback } from "react";
import { useToast } from "@rajkumarganesan93/uicontrols";
import type { ApiError } from "@rajkumarganesan93/uifunctions";
import type { Shipment, CreateShipmentInput, UpdateShipmentInput } from "../../domain";
import { freightUseCases } from "../../di/container";

export function useFreightList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await freightUseCases.listShipments();
      setShipments(data);
    } catch (err) {
      showToast("error", "Failed to load shipments");
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return { shipments, loading, refetch: fetchShipments };
}

export function useFreightDetail(uid: string | undefined) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    freightUseCases
      .getShipment(uid)
      .then((data) => setShipment(data))
      .catch(() => setShipment(null))
      .finally(() => setLoading(false));
  }, [uid]);

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
      showToast("error", (err as ApiError).message || "Failed to create shipment");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateShipment = async (uid: string, data: UpdateShipmentInput): Promise<boolean> => {
    setSaving(true);
    try {
      const result = await freightUseCases.updateShipment(uid, data);
      showToast("success", result.message);
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message || "Failed to update shipment");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { saving, createShipment, updateShipment };
}

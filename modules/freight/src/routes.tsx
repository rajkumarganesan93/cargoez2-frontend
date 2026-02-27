import { lazy } from "react";

const FreightList = lazy(() => import("./presentation/pages/FreightList"));
const FreightDetail = lazy(() => import("./presentation/pages/FreightDetail"));
const FreightForm = lazy(() => import("./presentation/pages/FreightForm"));

export const freightRoutes = [
  { path: "freight", element: FreightList, label: "Freight" },
  { path: "freight/new", element: FreightForm, label: "New Shipment" },
  { path: "freight/:id", element: FreightDetail, label: "Freight Detail" },
  { path: "freight/:id/edit", element: FreightForm, label: "Edit Shipment" },
];

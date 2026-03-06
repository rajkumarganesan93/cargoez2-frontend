import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const FreightList = lazy(() => import("./presentation/pages/FreightList"));
const FreightDetail = lazy(() => import("./presentation/pages/FreightDetail"));
const FreightForm = lazy(() => import("./presentation/pages/FreightForm"));

export default function App() {
  return (
    <div className="min-h-screen bg-bg-default p-6">
      <h1 className="text-xl font-bold text-text-primary mb-4">Freight Module (Standalone)</h1>
      <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/freight" replace />} />
          <Route path="/freight" element={<FreightList />} />
          <Route path="/freight/new" element={<FreightForm />} />
          <Route path="/freight/:id" element={<FreightDetail />} />
          <Route path="/freight/:id/edit" element={<FreightForm />} />
        </Routes>
      </Suspense>
    </div>
  );
}

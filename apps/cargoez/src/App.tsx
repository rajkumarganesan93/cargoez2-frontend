import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { contactsRoutes } from "@rajkumarganesan93/contacts";
import { freightRoutes } from "@rajkumarganesan93/freight";
import { booksRoutes } from "@rajkumarganesan93/books";
import { AppLayout } from "./presentation/layouts/AppLayout";
import Dashboard from "./presentation/pages/Dashboard";
import UiDemo from "./presentation/pages/UiDemo";

const allRoutes = [...contactsRoutes, ...freightRoutes, ...booksRoutes];

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ui-demo" element={<UiDemo />} />
        {allRoutes.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.path}
              path={`/${route.path}`}
              element={
                <Suspense fallback={<div className="p-6 text-text-secondary">Loading...</div>}>
                  <Component />
                </Suspense>
              }
            />
          );
        })}
      </Route>
    </Routes>
  );
}

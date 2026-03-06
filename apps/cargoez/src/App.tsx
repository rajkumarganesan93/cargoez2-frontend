import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ServiceErrorBoundary } from "@rajkumarganesan93/uicontrols";
import { AppLayout } from "./presentation/layouts/AppLayout";
import Dashboard from "./presentation/pages/Dashboard";
import UiDemo from "./presentation/pages/UiDemo";

function FederatedRoute({ serviceName, children }: { serviceName: string; children: React.ReactNode }) {
  const location = useLocation();
  return (
    <ServiceErrorBoundary key={location.pathname} serviceName={serviceName}>
      <Suspense fallback={<div className="p-6 text-text-secondary">Loading...</div>}>
        {children}
      </Suspense>
    </ServiceErrorBoundary>
  );
}

const ContactsList = lazy(() => import("contacts/ContactsList"));
const ContactDetail = lazy(() => import("contacts/ContactDetail"));
const ContactForm = lazy(() => import("contacts/ContactForm"));

const FreightList = lazy(() => import("freight/FreightList"));
const FreightDetail = lazy(() => import("freight/FreightDetail"));
const FreightForm = lazy(() => import("freight/FreightForm"));

const BooksList = lazy(() => import("books/BooksList"));
const BookDetail = lazy(() => import("books/BookDetail"));
const BookForm = lazy(() => import("books/BookForm"));

const federatedRoutes = [
  { path: "contacts", element: ContactsList, service: "Contacts" },
  { path: "contacts/:id", element: ContactDetail, service: "Contacts" },
  { path: "contacts/new", element: ContactForm, service: "Contacts" },
  { path: "contacts/:id/edit", element: ContactForm, service: "Contacts" },
  { path: "freight", element: FreightList, service: "Freight" },
  { path: "freight/new", element: FreightForm, service: "Freight" },
  { path: "freight/:id", element: FreightDetail, service: "Freight" },
  { path: "freight/:id/edit", element: FreightForm, service: "Freight" },
  { path: "books", element: BooksList, service: "Books" },
  { path: "books/:id", element: BookDetail, service: "Books" },
  { path: "books/new", element: BookForm, service: "Books" },
  { path: "books/:id/edit", element: BookForm, service: "Books" },
];

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ui-demo" element={<UiDemo />} />
        {federatedRoutes.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.path}
              path={`/${route.path}`}
              element={
                <FederatedRoute serviceName={route.service}>
                  <Component />
                </FederatedRoute>
              }
            />
          );
        })}
      </Route>
    </Routes>
  );
}

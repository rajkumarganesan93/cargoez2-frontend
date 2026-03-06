import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./presentation/layouts/AppLayout";
import Dashboard from "./presentation/pages/Dashboard";
import UiDemo from "./presentation/pages/UiDemo";

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
  { path: "contacts", element: ContactsList },
  { path: "contacts/:id", element: ContactDetail },
  { path: "contacts/new", element: ContactForm },
  { path: "contacts/:id/edit", element: ContactForm },
  { path: "freight", element: FreightList },
  { path: "freight/new", element: FreightForm },
  { path: "freight/:id", element: FreightDetail },
  { path: "freight/:id/edit", element: FreightForm },
  { path: "books", element: BooksList },
  { path: "books/:id", element: BookDetail },
  { path: "books/new", element: BookForm },
  { path: "books/:id/edit", element: BookForm },
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

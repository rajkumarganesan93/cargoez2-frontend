import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const ContactsList = lazy(() => import("./presentation/pages/ContactsList"));
const ContactDetail = lazy(() => import("./presentation/pages/ContactDetail"));
const ContactForm = lazy(() => import("./presentation/pages/ContactForm"));

export default function App() {
  return (
    <div className="min-h-screen bg-bg-default p-6">
      <h1 className="text-xl font-bold text-text-primary mb-4">Contacts Module (Standalone)</h1>
      <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/contacts" replace />} />
          <Route path="/contacts" element={<ContactsList />} />
          <Route path="/contacts/new" element={<ContactForm />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/contacts/:id/edit" element={<ContactForm />} />
        </Routes>
      </Suspense>
    </div>
  );
}

import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

const BooksList = lazy(() => import("./presentation/pages/BooksList"));
const BookDetail = lazy(() => import("./presentation/pages/BookDetail"));
const BookForm = lazy(() => import("./presentation/pages/BookForm"));

export default function App() {
  return (
    <div className="min-h-screen bg-bg-default p-6">
      <h1 className="text-xl font-bold text-text-primary mb-4">Books Module (Standalone)</h1>
      <Suspense fallback={<div className="text-text-secondary">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<BookForm />} />
        </Routes>
      </Suspense>
    </div>
  );
}

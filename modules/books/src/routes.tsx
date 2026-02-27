import { lazy } from "react";

const BooksList = lazy(() => import("./pages/BooksList"));
const BookDetail = lazy(() => import("./pages/BookDetail"));
const BookForm = lazy(() => import("./pages/BookForm"));

export const booksRoutes = [
  { path: "books", element: BooksList, label: "Books" },
  { path: "books/:id", element: BookDetail, label: "Book Detail" },
  { path: "books/new", element: BookForm, label: "New Entry" },
  { path: "books/:id/edit", element: BookForm, label: "Edit Entry" },
];

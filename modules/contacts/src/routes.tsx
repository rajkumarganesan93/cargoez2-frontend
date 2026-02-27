import { lazy } from "react";

const ContactsList = lazy(() => import("./pages/ContactsList"));
const ContactDetail = lazy(() => import("./pages/ContactDetail"));
const ContactForm = lazy(() => import("./pages/ContactForm"));

export const contactsRoutes = [
  { path: "contacts", element: ContactsList, label: "Contacts" },
  { path: "contacts/:id", element: ContactDetail, label: "Contact Detail" },
  { path: "contacts/new", element: ContactForm, label: "New Contact" },
  { path: "contacts/:id/edit", element: ContactForm, label: "Edit Contact" },
];

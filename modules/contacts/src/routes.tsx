import { lazy } from "react";

const ContactsList = lazy(() => import("./presentation/pages/ContactsList"));
const ContactDetail = lazy(() => import("./presentation/pages/ContactDetail"));
const ContactForm = lazy(() => import("./presentation/pages/ContactForm"));

export const contactsRoutes = [
  { path: "contacts", element: ContactsList, label: "Contacts" },
  { path: "contacts/:id", element: ContactDetail, label: "Contact Detail" },
  { path: "contacts/new", element: ContactForm, label: "New Contact" },
  { path: "contacts/:id/edit", element: ContactForm, label: "Edit Contact" },
];

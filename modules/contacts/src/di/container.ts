import { ContactApiRepository } from "../infrastructure";
import { ContactUseCases } from "../application";

const contactRepository = new ContactApiRepository();
export const contactUseCases = new ContactUseCases(contactRepository);

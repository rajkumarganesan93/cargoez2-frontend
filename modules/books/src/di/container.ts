import { BookApiRepository } from "../infrastructure";
import { BookUseCases } from "../application";

const bookRepository = new BookApiRepository();
export const bookUseCases = new BookUseCases(bookRepository);

import { FreightApiRepository } from "../infrastructure";
import { FreightUseCases } from "../application";

const freightRepository = new FreightApiRepository();
export const freightUseCases = new FreightUseCases(freightRepository);

import { NotFoundException } from "./exceptions";

export const UnknownRoutesHandler = () => {
    throw new NotFoundException(`La resource demandée n'existe pas`)
}
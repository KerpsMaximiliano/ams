import { Response } from "./response";

export interface AbmPosiciones {
    par_modo: string,
    id: string,
    codigo: number,
    descripcion: string,
    descripcion_reducida: string,
}

export type AbmPosicionesResponse = Response<AbmPosiciones[]>;
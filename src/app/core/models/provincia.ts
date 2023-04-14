import { Response } from "./response";

export interface Provincia {
    par_modo: string,
    codigo: number,
    nombre_provincia: string,
    codifica_altura: number,
    codigo_provincia: string,
    flete_transportista: string
}

export type ProvinciaResponse = Response<Provincia[]>;

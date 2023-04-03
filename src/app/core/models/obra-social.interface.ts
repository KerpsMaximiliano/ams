import { Response } from "./response";

export interface ObraSocial {
    par_modo: string,
    id: number;
    descripcion: string;
    formulario: string;
    tipo: string;
    tipo_de_documento: number;
}

export type ObraSocialResponse = Response<ObraSocial[]>;
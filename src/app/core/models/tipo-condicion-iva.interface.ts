import { Response } from "./response";

export interface CondicionIva {
    par_modo: string,
    id: number;
    descripcion: string;
    codigo: string;
    descripcion_reducida: string;
    formulario: string;
    tipo_de_documento: number
}

export type CondicionIvaResponse = Response<CondicionIva[]>;
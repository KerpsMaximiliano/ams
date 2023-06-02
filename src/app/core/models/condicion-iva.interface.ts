import { Response } from "./response";

export interface ICondicionIva {
    par_modo: string,
    id: number;
    descripcion: string;
    descripcion_reducida: string;
    formulario_AB: string;
    codigo_de_IVA: string;
}

export type CondicionIvaResponse = Response<ICondicionIva[]>;
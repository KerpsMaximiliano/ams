import { Response } from "./response";

export interface TipoDocumento {
    par_modo: string,
    id: number;
    descripcion: string;
    descripcion_reducida: string;
    control_cuit: string;
    tipo_de_documento: number
}

export type TipoDocumentoResponse = Response<TipoDocumento[]>;
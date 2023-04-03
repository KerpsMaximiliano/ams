import { Response } from "./response";

export interface AbmDepartamento {
    par_modo: string,
    letra_provincia: string,
    codigo_departamento: number,
    descripcion: string,
    descripcion_reducida: string,
}

export type AbmDepartamentoResponse = Response<AbmDepartamento[]>;
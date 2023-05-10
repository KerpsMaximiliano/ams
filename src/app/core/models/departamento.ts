import { Response } from "./response";

export interface Departamento {
    par_modo: string,
    letra_provincia: string,
    codigo_departamento: number,
    descripcion: string,
    descripcion_reducida: string,
}

export type DepartamentoResponse = Response<Departamento[]>;
import { Response } from "./response";

export interface AbmPosiciones {
    par_modo: string,
    codigo_posicion: number,
    descripcion: string,
    domicilio: string,
    codigo_postal: string,
    sub_codigo_postal: string,
    control_rechazo: string,
    yes_no: string,
    fecha_vigencia: string,
    letra_provincia: string,
}

export type AbmPosicionesResponse = Response<AbmPosiciones[]>;
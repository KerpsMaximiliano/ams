import { IResponse } from "./response.interface";

export interface IMovimientoProducto {
    par_modo: string,
    tipo_motivo: string;
    codigo_motivo: number;
    id_producto: number;
    descripcion: string;
    datos_adicionales: string;
    otra_cobertura: string;
}
export type IMovimientoProductoResponse = IResponse<IMovimientoProducto[]>;


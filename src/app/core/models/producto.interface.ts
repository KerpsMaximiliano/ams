import { Response } from './response';

export interface IProducto {
  par_modo: string;
  codigo_producto: number;
  descripcion_producto: string;
  descripcion_reducida: string;
  tipo_producto: string;
  administrado: string;           // ??
  clase_producto: string;
  codigo_fuente_ingreso: string;
  empresa: number;                // ??
  obra_social: string;            // ??
}

export type IProductoResponse = Response<IProducto[]>;
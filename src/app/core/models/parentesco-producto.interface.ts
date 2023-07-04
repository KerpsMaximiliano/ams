import { IResponse } from './response.interface';

export interface IParentescoProducto {
  par_modo: string;
  id: number;
  producto: number;
  codigo_parentesco: number;
  descripcion: string;
  permite_darse_baja: string;
  pide_fecha_enlace: string;
  codigo_afip: number;
}

export interface IParentesco {
  codigo: number;
  descripcion: string;
}

export type IParentescoProductoResponse = IResponse<IParentescoProducto[]>;

import { IResponse } from './response.interface';

export interface ISubmotivoMovimiento {
  par_modo: string;
  movimiento: string;
  codigo_motivo: number;
  codigo_producto: number;
  producto: string;
  codigo_submotivo: number;
  descripcion: string;
  fecha_vigencia: number;
}

export type ISubmotivoMovimientoResponse = IResponse<ISubmotivoMovimiento[]>;

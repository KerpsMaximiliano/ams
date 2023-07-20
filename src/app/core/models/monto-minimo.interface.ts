import { IResponse } from './response.interface';

export interface IMontoMinimo {
  par_modo: string;
  actividad: number;
  seccion: string;
  fecha_vigencia: number;
  importe_minimo: number;
  movimiento: string;
}

export type IMontoMinimoResponse = IResponse<IMontoMinimo[]>;

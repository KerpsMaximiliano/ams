import { IResponse } from './response.interface';

export interface IPosicion {
  par_modo: string;
  codigo_posicion: number;
  descripcion: string;
  domicilio: string;
  codigo_postal: string;
  sub_codigo_postal: string;
  control_rechazo: string;
  yes_no: string;
  fecha_vigencia: string;
  letra_provincia: string;
}

export type IPosicionResponse = IResponse<IPosicion[]>;

import { IResponse } from './response.interface';

export interface IPreguntasDDJJ {
  par_modo: string;
  modelo_formulario: string;
  nro_preg: number;
  cantidad_lineas_resp: number;
  pide_fecha: string;
  yes_no: string;
  primer_texto_preg: string;
  segundo_texto_preg: string;
}

export type IPreguntasDDJJResponse = IResponse<IPreguntasDDJJ[]>;

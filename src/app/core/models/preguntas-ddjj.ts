import { Response } from './response';

export interface PreguntasDDJJ {
  par_modo: string;
  modelo_formulario: string;
  nro_preg: number;
  cantidad_lineas_resp: number;
  pide_fecha: string;
  yes_no: string;
  primer_texto_preg: string;
  segundo_texto_preg: string;
}

export type PreguntasDDJJResponse = Response<PreguntasDDJJ[]>;

import { Response } from './response';

export interface EstadoCivil {
  par_modo: string;
  codigo_estado_civil: string;
  description: string;
}

export type EstadoCivilResponse = Response<EstadoCivil[]>;

import { Response } from './response';

export interface IEstadoCivil {
  par_modo: string;
  codigo_estado_civil: string;
  description: string;
}

export type IEstadoCivilResponse = Response<IEstadoCivil[]>;

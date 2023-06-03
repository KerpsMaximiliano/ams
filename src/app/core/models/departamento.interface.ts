import { IResponse } from './response.interface';

export interface IDepartamento {
  par_modo: string;
  letra_provincia: string;
  codigo_departamento: number;
  descripcion: string;
  descripcion_reducida: string;
}

export type IDepartamentoResponse = IResponse<IDepartamento[]>;

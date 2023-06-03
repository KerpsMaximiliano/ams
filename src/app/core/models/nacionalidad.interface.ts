import { IResponse } from './response.interface';

export interface INacionalidad {
  par_modo: string;
  codigo_nacionalidad_nuevo: number;
  descripcion: string;
  codigo_sistema_anterior: number;
}

export type INacionalidadResponse = IResponse<INacionalidad[]>;

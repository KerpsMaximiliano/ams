import { IResponse } from './response.interface';

export interface IProvincia {
  par_modo: string;
  codigo: number;
  nombre_provincia: string;
  codifica_altura: number;
  codigo_provincia: string;
  flete_transportista: string;
}

export type IProvinciaResponse = IResponse<IProvincia[]>;

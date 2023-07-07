import { IResponse } from './response.interface';

export interface ICondicionIva {
  par_modo: string;
  codigo_de_IVA: string;
  descripcion: string;
  descripcion_reducida: string;
  formulario_AB: string;
}

export type ICondicionIvaResponse = IResponse<ICondicionIva[]>;

import { IResponse } from './response.interface';

export interface ITambo {
  par_modo: string;
  id_empresa: number;
  id_tambos: number;
  razon_social: string;
  grasa_ent: number;
  fecha_suspension: number;
  fecha_rehabilitacion: number;
  localidad: string;
  provincia: string;
  fecha_baja: number;
  emp_vinc_ent: number;
  ent_sancor: number;
  canal: number;
  estado: null;
}

export type ITamboResponse = IResponse<ITambo[]>;

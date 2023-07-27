import { Response } from './response';

export interface IEntidad {
  nro_asesor: number;
  canal: number;
  tipo_asesor: string;
  id_empresa_persona: number;
  desc_empresa: string;
  nombre_per: string;
  apellido_Per: string;
}

export type IEntidadResponse = Response<IEntidad[]>;

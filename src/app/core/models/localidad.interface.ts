import { IResponse } from './response.interface';

export interface ILocalidad {
  par_modo: string;
  codigo_postal: number;
  sub_codigo_postal: string;
  descripcion: string;
  desc_prov: string;
  letra_provincia: string;
  flete_transporte: string;
  posicion_referente: string;
  visitado_auditor: string;
  zona_promocion: string;
  desc_depto: string;
  codigo_departamento: string;
  zona_envio: string;
  ingreso_ticket: string;
  zona_atencion: string;
  cant_habitantes: string;
}

export type ILocalidadResponse = IResponse<ILocalidad[]>;

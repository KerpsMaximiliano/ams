import { IResponse } from './response.interface';

export interface IMotivoMovimiento {
  par_modo: string;
  tipo_motivo: string;
  id_motivo: number;
  descripcion: string;
  datos_adic_SN: string;
  fecha_inicio_vigencia: number;
  fecha_fin_vigencia: number;
}

export type IMotivoMovimientoResponse = IResponse<IMotivoMovimiento[]>;

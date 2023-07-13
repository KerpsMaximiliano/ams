import { IResponse } from './response.interface';

export interface IEmpresaFactura {
  par_modo: string;
  id_empresa: number;
  descripcion: string;
  calle: string;
  nro_puerta: number;
  piso: number;
  departamento: string;
  codigo_postal: number;
  sub_codigo_postal: number;
  nro_tel: number;
  nro_fax: number;
  email: string;
  codigo_iva: number;
  cuit: number;
  fecha_vto_cuit: number;
  moneda1: number;
  ref_contable_acreedora1: string;
  moneda2: number;
  ref_contable_acreedora2: string;
  cta_banco_ams: string;
  campo_desc1: string;
  campo_desc2: string;
  comprobante_generar: string;
  codigo_sicone: string;
  gen_min_como_empr: string;
  codigo_postal_arg: string;
  nro_inscripcion_igb: number;
  fecha_inicio_act: number;
  trabaja_ref_cont: string;
  fact_cr_elec: string;
  cbu_nro: string;
}
export type IEmpresaFacturaResponse = IResponse<IEmpresaFactura[]>;

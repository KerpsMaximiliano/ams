import { IResponse } from './response.interface';

export interface IFuenteIngreso {
  par_modo: string;
  codigo_fuente_ingreso: number;
  tipo_fuente: string;
  codigo_fuente_admin: number;
  descripcion: string;
  descripcion_reducida: string;
  solicita_ref: string;
  dia_corte: number;
  empresa_asociada: number;
  nro_solicitud: number;
  fecha_ultima_liquidacion: number;
  aporte_adicional: string;
  fuente_aporte_adicional: number;
  concepto_aporte_adicional: number;
  controla_dec_jur: string;
  comprobante_general: string;
  condicion_venta: number;
  sub_prog_calc: string;
  ref_contable_asociada: string;
  concepto_aporte: number;
  concepto_arancel: number;
  agrupa_entidades: string;
  grupo_familiar_imprimir: string;
  numeracion_auto: string;
  talonario: number;
  liquida_punitorio: string;
  liquida_reintegro: string;
  liquida_planes_mix: string;
  liquida_planes_monotributo: string;
  selecciona_productos_liq: string;
  condicion_aporte_adic_dec: number;
  agrupador_capita: number;
  liquidacion_mensual: string;
  condicion_venta_venc: number;
  condicion_venta_dos_venc: number;
  desc_empresa: null;
  es_admin: null;
  es_subord: null;
  es_mixta: null;
  id_excluido: null;
  descripcion_fuente_adm_mixta: string;
}

export type IFuenteIngresoResponse = IResponse<IFuenteIngreso[]>;

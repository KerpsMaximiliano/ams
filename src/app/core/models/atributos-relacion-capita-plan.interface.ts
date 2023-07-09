import { Response } from './response';

export interface IAtributosRelacionCapitaPlan {
  par_modo: null;
  codigo_fuente_adm_mixta: number;
  cod_fuente_subordinada: number;
  producto_cap_adm: number;
  plan_producto_cap_adm: string;
  producto_cap_sub: number;
  genera_liquidacion: string;
  mod_carga_afiliacion: string;
  solicita_ddjj: string;
  liquida_mensualmente: string;
  calcula_comision_SN: string;
  recupera_Ob_Soc: string;
  reaseguro_SN: string;
  legajo: string;
  zona: string;
  division: string;
  seccion: string;
  subseccion: string;
  val_cod_empresa: string;
  controla_dec_juradas: string;
  modelo_dec_jurada_vig: string;
  modelo_cuest_baja_vig: string;
  descripcion: string;
}

export type IAtributosRelacionCapitaPlanResponse = Response<
  IAtributosRelacionCapitaPlan[]
>;

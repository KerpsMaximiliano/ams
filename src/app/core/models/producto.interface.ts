import { IResponse } from './response.interface';

export interface IProducto {
  par_modo: string;
  codigo_producto: number;
  descripcion_producto: string;
  descripcion_reducida: string;
  clase_producto: string;
  tipo_producto: string;
  codigo_fuente_ingreso: number; // Cu11 Fuentes de Ingreso.
  numero_empresa_factura: number; // Referencia al número de empresa qué factura por.
  subprograma_afiliacion: string;
  subprograma_parametros: string;
  subprograma_calculo_valores: string;
  subprograma_calculo_comisiones: string;
  factura_primera: string;
  factura_segunda: string;
  factura_tercera: string;
  dia_vencimiento: number;
  tipo_capita: string;
  capita_empresa: string;
  fecha_bon_perm: string;
  solicita_forma_pago: string;
  calcula_fecha_inicio_servicio: string;
  tipo_producto_vol_obl: string;
  subsidio_corporativo: string;
  requiere_nro_form_sss: string;
  periodo_generacion_factura: number;
  periodo_a_evaluar: number;
  ultimo_periodo_liquidado: number;
  programa_recalculo: string;
  fecha_baja_producto: number; // Fecha de baja del proyecto.
  codigo_obra_social: number; // Referencia al código de Obra Social
  producto_administrador: number; // Referencia al producto primario.
  clasificador: string;

  // * No estan en el insert.
  descripcion_empresa: string;
  descripcion_producto_administrador: string;
  descripcion_obra_social: string;
  descripcion_fuente_ingreso: string;
  requiere_generacion_factura: number; // !
}

export interface IProductoObraSocial {
  id_obrasocial: number;
  descripcion: string;
}

export type IProductoResponse = IResponse<IProducto[]>;

import { IResponse } from "./response.interface";

export interface IProductoAdministrador {
    par_modo: string;
    codigo_producto: number;
    descripcion_producto: string;
    descripcion_reducida: string;
    clase_producto: string;
    codigo_fuente_ingreso: number;
    subprograma_afiliacion: string;
    subprograma_parametros: string;
    subprograma_calculo_valores: string;
    subprograma_calculo_comisiones: string;
    factura_primera: string;
    factura_segunda: string;
    factura_tercera: string;
    numero_empresa_factura: IEmpresa;
    dia_vencimiento: number;
    tipo_capita: string;
    capita_empresa: string;
    fecha_bon_perm: string;
    solicita_forma_pago: string;
    calcula_fecha_inicio_servicio: string;
    tipo_producto_vol_obl: string;
    tipo_producto: string;
    subsidio_corporativo: string;
    requiere_nro_form_sss: string;
    periodo_generacion_factura: number;
    periodo_a_evaluar: number;
    ultimo_periodo_liquidado: number;
    programa_recalculo: string;
    fecha_baja_producto: number;
    descripcion_empresa: string;
    producto_administrador: number;
    codigo_obra_social: string;
}

export interface IEmpresa{
    codigo_empresa: number;
    descripcion: string;
}

export type IProductoResponse = IResponse<IProductoAdministrador[]>;

import { IResponse } from "./response.interface";

export interface IMvmtsNovedadesAuto {
    par_modo: string;
    capita_origen: number;
    producto_origen: number; 
    sub_producto_origen: number; 
    plan_origen: string; 
    mov_origen: string; 
    monotributo: string; 
    capita_rel: number; 
    sec_prod_rel: number; 
    producto_relacionado: number; 
    sub_prod_rel: number; 
    movimiento_rel: string; 
    novedad_vinculo: string; 
    clase_prod: string; 
    plan_cambio: string; 
    opcion_monotributo: number; 
    codigo_motivo: number;
}

export interface IPlan{
    codigo_producto: number;
    plan: string;
    descripcion: string;
}

export type MvmtsNovedadesAutoResponse = IResponse<IMvmtsNovedadesAuto[]>;
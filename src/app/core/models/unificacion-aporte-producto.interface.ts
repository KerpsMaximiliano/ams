import { IResponse } from './response.interface';

export interface IUnificacionAporteProducto {
  par_modo: string;
  producto_principal: number;
  producto_principal_descripcion: string;
  subproducto_principal: number;
  subproducto_principal_descripcion: string;
  producto_secundario: number;
  producto_secundario_descripcion: string;
  subproducto_secundario: number;
  subproducto_secundario_descripcion: string;
  unifica_aportes: string;
}

export type IUnificacionAporteProductoResponse = IResponse<
  IUnificacionAporteProducto[]
>;

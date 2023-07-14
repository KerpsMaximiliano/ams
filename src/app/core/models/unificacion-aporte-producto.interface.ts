import { IResponse } from './response.interface';

export interface IUnificacionAporteProducto {
  par_modo: string;
  producto_principal: number;
  subproducto_principal: number;
  producto_secundario: number;
  subproducto_secundario: number;
  producto_principal_descripcion: string;
  subproducto_principal_descripcion: string;
  unifica_aportes: string;
}

export type IUnificacionAporteProductoResponse = IResponse<
  IUnificacionAporteProducto[]
>;

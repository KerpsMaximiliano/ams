import { IResponse } from './response.interface';

export interface IUnificacionAporte {
  par_modo: string;
  producto_principal: string;
  producto_principal_cod: number;
  producto_secundario: string;
  producto_secundario_cod: number;
  subproducto_principal: string;
  subproducto_principal_cod: number;
  subproducto_secundario: string;
  subproducto_secundario_cod: number;
  unifica_aportes: string;
}

export type IUnificacionAporteResponse = IResponse<IUnificacionAporte[]>;

import { IResponse } from './response.interface';

export interface IExtencionFuenteIngreso {
  par_modo: string;
  vigencia: string;
  fuenteingreso: string;
  producto: string;
  remuneracionDesde: string;
  remuneracionHasta: string;
  coeficiente1: number;
  coeficiente2: number;
  coeficiente3: number;
  coeficiente4: number;
  coeficiente5: number;
}

export type IExtencionFuenteIngresoResponse = IResponse<IExtencionFuenteIngreso[]>;
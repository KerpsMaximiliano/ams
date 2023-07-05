import { IResponse } from './response.interface';

export interface IExtencionFuenteIngreso {
  par_modo: string;
  fecha_de_vigencia: number;
  codigo_fuente_ingreso: number;
  fuente_ingreso: string;
  producto: number;
  producto_des: string;
  remuneracion_desde: number;
  remuneracion_hasta: number;
  coeficiente_uno: number;
  coeficiente_dos: number;
  coeficiente_tres: number;
  coeficiente_cuatro: number;
  coeficiente_cinco: number;
}

export type IExtencionFuenteIngresoResponse = IResponse<
  IExtencionFuenteIngreso[]
>;

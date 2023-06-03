import { IResponse } from './response.interface';

export interface IFormaPago {
  par_modo: string;
  forma_pago: string;
  codigo: number;
  description: string;
  solicita_datos_ad: string;
  codigo_banco: number;
  trabaja_archivos: string;
  trabaja_rechazos: string;
  nombre_tarjeta_nemot: string;
  codigo_tarjeta_de_baja: string;
}

export type IFormaPagoResponse = IResponse<IFormaPago[]>;

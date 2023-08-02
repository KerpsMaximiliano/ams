import { IEmpresaFactura } from './empresa-factura.interface';
import { IFormaPago } from './formas-pago.interface';
import { IResponse } from './response.interface';

export interface IDatoComercio {
  par_modo: string;
  id_empresa: number;
  forma_pago: string;
  codigo_tarjeta: number;
  nro_comercio: number;
  codigo_servicio: string;
  nro_caja: number;
  id_banco: number;
  nro_suc: number;
  car_dest: string;
  prg_gen: string;
  forma_pago_descripcion: string;
  banco_descripcion: string;
}

export interface IBanco {
  par_modo: string;
  codigo: number;
  description: string;
}

export interface ITipoFormaPago {
  id_forma_pago: string;
  descripcion?: string;
  forma_habilitada: string;
}

export interface IFiltroDatoComercio {
  empresaFactura?: IEmpresaFactura;
  formaPago?: ITipoFormaPago;
  tarjeta?: IFormaPago;
}

export interface IListFormaPago {
  id_forma_pago: string;
  descripcion: string;
  forma_habilitada: string;
}

export type IDatoComercioResponse = IResponse<IDatoComercio[]>;

import { Response } from './response';

export interface IProducto {
  par_modo: string;
}

export type IProductoResponse = Response<IProducto[]>;

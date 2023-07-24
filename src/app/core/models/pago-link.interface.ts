import { IResponse } from './response.interface';

export interface IPagoLink {
  par_modo: string;
  empresa_factura: number;
  codigo_forma_pago: number;
  descripcion_forma_pago: string;
  id_auditoria: string;
}
export type IPagoLinkResponse = IResponse<IPagoLink[]>;

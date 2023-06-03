import { IResponse } from './response.interface';

export interface ITipoDocumento {
  par_modo: string;
  id: number;
  descripcion: string;
  descripcion_reducida: string;
  control_cuit: string;
  tipo_de_documento: number;
}

export type ITipoDocumentoResponse = IResponse<ITipoDocumento[]>;

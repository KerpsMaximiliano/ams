import { IResponse } from './response.interface';

export interface ITipoDocumento {
  par_modo: string;
  tipo_de_documento: number;
  descripcion: string;
  descripcion_reducida: string;
  control_cuit: string;
}

export type ITipoDocumentoResponse = IResponse<ITipoDocumento[]>;

/**
 * par_modo: string - CRUD.
 * CRUD:
 * C: Create (insertar).
 * R: Read (consultar).
 * U: Update (actualizar/modificar).
 * D: Delete (eliminar).
 *
 * DATOS REF. TABLA: T02FTID.
 * tipo_de_documento:     number - Tipo Documento.
 * descripcion:           string - Descripción.
 * descripcion_reducida:  string - Descripción reducida.
 * control_cuit:          string - Control de CUIT.
 */

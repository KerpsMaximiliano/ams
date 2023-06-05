import { IResponse } from './response.interface';

export interface IProvincia {
  par_modo: string;
  codigo: number; // Error.
  nombre_provincia: string;
  codifica_altura: string; // Error.
  codigo_provincia: number; // Error.
  flete_transportista: number; // Error.
}

export type IProvinciaResponse = IResponse<IProvincia[]>;

/**
 * par_modo: string - CRUD.
 * CRUD:
 * C: Create (insertar).
 * R: Read (consultar).
 * U: Update (actualizar/modificar).
 * D: Delete (eliminar).
 *
 * DATOS REF. TABLA: T09FPCI.
 * codigo:                string - Cód.provincia.
 * nombre_provincia:      string - Descripción.
 * codifica_altura:       string - Codifica Alturas y Calles.
 * codigo_provincia:      number - CODIGO DE PROVINCIA.
 * flete_transportista:   number - Porc. Flete a Transportistas.
 *
 * codifica_altura y codigo_provincia: error.
 * flete_transportista: verificar tipo.
 */

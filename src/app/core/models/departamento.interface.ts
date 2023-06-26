import { IResponse } from './response.interface';

export interface IDepartamento {
  par_modo: string;
  letra_provincia: string;
  nombre_provincia?: string;
  codigo_departamento: number;
  descripcion: string;
  descripcion_reducida: string;
}

export type IDepartamentoResponse = IResponse<IDepartamento[]>;

/**
 * par_modo: string - CRUD.
 * CRUD:
 * C: Create (insertar).
 * R: Read (consultar).
 * U: Update (actualizar/modificar).
 * D: Delete (eliminar).
 *
 * DATOS REF. TABLA: T10FDTO.
 * letra_provincia:       string - Letra provincia.
 * codigo_departamento:   number - Código departamento.
 * descripcion:           string - Descripción.
 * descripcion_reducida:  string - Descripción reducida.
 */

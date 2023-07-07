import { IResponse } from './response.interface';

export interface INacionalidad {
  par_modo: string;
  codigo_nacionalidad_nuevo: number;
  descripcion: string;
  codigo_sistema_anterior: number;
}

export type INacionalidadResponse = IResponse<INacionalidad[]>;

/**
 * par_modo: string - CRUD.
 * CRUD:
 * C: Create (insertar).
 * R: Read (consultar).
 * U: Update (actualizar/modificar).
 * D: Delete (eliminar).
 *
 * DATOS REF. TABLA: T03FNAC.
 * codigo_nacionalidad_nuevo:     number - Cód.nacionalidad.
 * descripcion:                   string - Descripción.
 * Codigo sistema ant.:           number - Codigo sistema ant.
 */

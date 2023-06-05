import { IResponse } from './response.interface';

export interface IFormaPago {
  par_modo: string;
  codigo: number;
  forma_pago: string;
  description: string;
  solicita_datos_ad: string;
  codigo_banco: number;
  trabaja_archivos: string;
  trabaja_rechazos: string;
  nombre_tarjeta_nemot: string;
  codigo_tarjeta_de_baja: string;
}

export type IFormaPagoResponse = IResponse<IFormaPago[]>;

/**
 * par_modo: string - CRUD.
 * CRUD:
 * C: Create (insertar).
 * R: Read (consultar).
 * U: Update (actualizar/modificar).
 * D: Delete (eliminar).
 *
 * DATOS REF. TABLA: T15FTAR.
 * codigo:                    number - Código.
 * forma_pago:                string - Forma de pago.
 * description:               string - Descripción.
 * solicita_datos_ad:         string - Solicita Datos Adic.
 * codigo_banco:              number - Código Banco.
 * trabaja_archivos:          string - Trabaja con archivos.
 * trabaja_rechazos:          string - Trabaja con rechazos.
 * nombre_tarjeta_nemot:      string - Nombre tarjeta nemot.
 * codigo_tarjeta_de_baja:    string - Cod Tarjeta de Baja.
 */

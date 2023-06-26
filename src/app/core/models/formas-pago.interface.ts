import { IResponse } from './response.interface';

export interface IFormaPago {
  par_modo: string;
  codigo: number;
  forma_pago: string;
  description: string;
  nombre_tarjeta_nemot: string;
  solicita_datos_ad: string;
  codigo_banco: number;
  trabaja_archivos: string;
  trabaja_rechazos: string;
  codigo_tarjeta_de_baja: string;
  desc_banco: string;
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
 * nombre_tarjeta_nemot:      string - Nombre tarjeta nemot.
 * codigo_banco:              number - Código Banco.
 * solicita_datos_ad:         string - Solicita Datos Adic.
 * trabaja_archivos:          string - Trabaja con archivos.
 * trabaja_rechazos:          string - Trabaja con rechazos.
 * codigo_tarjeta_de_baja:    string - Cod Tarjeta de Baja.
 * desc_banco:                . . .  - . . .
 */

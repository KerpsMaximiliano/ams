import { Response } from "./response";

export interface ObraSocial {
    par_modo?: string,
    codigo?: number;
    descripcion?: string;
    propone_fecha_patologia?: string;
    tipo_fecha_patologia?: string;
    tipo_obra_social_prepaga?: string;
    nro_registro?: number;
    similar_SMP?: string;
    omite_R420?: string;
}

export type ObraSocialResponse = Response<ObraSocial[]>;
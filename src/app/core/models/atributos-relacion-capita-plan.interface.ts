import { Response } from './response';

export interface IAtributosRelacionCapitaPlan {
  par_modo: string;
}

export type IAtributosRelacionCapitaPlanResponse = Response<IAtributosRelacionCapitaPlan[]>;

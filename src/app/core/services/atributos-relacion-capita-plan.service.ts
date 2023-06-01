import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IAtributosRelacionCapitaPlan, IAtributosRelacionCapitaPlanResponse } from '../models/atributos-relacion-capita-plan.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AtributosRelacionCapitaPlanService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getAtributosRelacionCapitaPlanCRUD(
    body: string
  ): Observable<IAtributosRelacionCapitaPlanResponse | IAtributosRelacionCapitaPlan> {
    return this.http.post<IAtributosRelacionCapitaPlanResponse>(
      `${this.environmentService.api}/`, // * Verificar
      body,
      httpOptions
    );
  }
}

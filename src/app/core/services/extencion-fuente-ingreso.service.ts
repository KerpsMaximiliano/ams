import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IExtencionFuenteIngreso } from '../models/extencion-fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ExtencionFuenteIngresoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IExtencionFuenteIngreso> {
    return this.http.post<IExtencionFuenteIngreso>(
      `${this.environmentService.api}/abmextensionfuenteingreso`,
      body,
      httpOptions
    );
  }
}

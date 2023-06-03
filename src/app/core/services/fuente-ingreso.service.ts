import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IFuenteIngresoResponse } from '../models/fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FuenteIngresoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  fuenteIngresoCRUD(body: string): Observable<IFuenteIngresoResponse> {
    return this.http.post<IFuenteIngresoResponse>(
      `${this.environmentService.api}/abmfuenteingresos`,
      body,
      httpOptions
    );
  }
}

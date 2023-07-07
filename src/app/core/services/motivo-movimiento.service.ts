import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IMotivoMovimientoResponse } from '../models/motivo-movimiento.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MotivoMovimientoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IMotivoMovimientoResponse> {
    return this.http.post<IMotivoMovimientoResponse>(
      `${this.environmentService.api}/abmmotivomovimiento`,
      body,
      httpOptions
    );
  }
}

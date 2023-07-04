import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { ISubMotivoMovimientoProductoResponse } from '../models/sub-motivo-movimiento.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class SubMotivoMovimientoProductoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<ISubMotivoMovimientoProductoResponse> {
    return this.http.post<ISubMotivoMovimientoProductoResponse>(
      `${this.environmentService.api}/abmsubmotivos`,
      body,
      httpOptions
    );
  }
}

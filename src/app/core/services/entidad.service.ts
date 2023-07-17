import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IEmpresaFacturaResponse } from '../models/empresa-factura.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IEmpresaFacturaResponse> {
    return this.http.post<IEmpresaFacturaResponse>(
      `${this.environmentService.api}/abmtambos`,
      body,
      httpOptions
    );
  }
}

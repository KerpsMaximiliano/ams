import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IEmpresaFactura } from '../models/empresa-factura.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EmpresaFacturaService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IEmpresaFactura> {
    return this.http.post<IEmpresaFactura>(
      `${this.environmentService.api}/abmempresas`,
      body,
      httpOptions
    );
  }
}

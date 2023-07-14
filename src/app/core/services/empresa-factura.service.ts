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
  empresaFactura: IEmpresaFactura
  back: boolean=false;
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  set(empresa_factura: IEmpresaFactura) {
    this.empresaFactura = empresa_factura;
  }

  get() {
    return this.empresaFactura;
  }

  public getBack(): boolean{
    return this.back;
  }

  public setBack(value: boolean): void {
    this.back = value;
  }

  CRUD(body: string): Observable<IEmpresaFactura> {
    return this.http.post<IEmpresaFactura>(
      `${this.environmentService.api}/abmempresas`,
      body,
      httpOptions
    );
  }
}

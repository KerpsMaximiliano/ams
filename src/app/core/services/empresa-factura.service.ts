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
  private empresaFactura: IEmpresaFactura[];
  private back: boolean=false;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  set(empresaFactura: IEmpresaFactura[]): void {
    this.empresaFactura = empresaFactura;
  }

  get(): IEmpresaFactura[] {
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

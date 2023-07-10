import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IUnificacionAporteProducto,
  IUnificacionAporteProductoResponse,
} from '../models/unificacion-aporte-producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UnificacionAporteProductoService {
  private unificacionAporteProducto: IUnificacionAporteProducto[];

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public get(): IUnificacionAporteProducto[] {
    return this.unificacionAporteProducto;
  }

  public set(unificacionAporteProducto: IUnificacionAporteProducto[]): void {
    this.unificacionAporteProducto = unificacionAporteProducto;
  }

  public CRUD(body: any): Observable<IUnificacionAporteProductoResponse> {
    return this.http.post<IUnificacionAporteProductoResponse>(
      `${this.environmentService.api}/abmunificacionaportes`,
      body,
      httpOptions
    );
  }
}

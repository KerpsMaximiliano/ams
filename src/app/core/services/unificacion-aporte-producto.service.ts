import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IUnificacionAporteProductoResponse } from '../models/unificacion-aporte-producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UnificacionAporteProductoService {
  producto: producto = {
    codigo_producto: 44,
    descripcion_producto: 'H*ola',
    codigo_producto_sub: 0,
    descripcion_producto_sub: '',
  };

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  // * se guarda producto CU 20
  set(producto: producto) {
    this.producto = producto;
  }

  // * se recupera el producto CU 24
  get() {
    return this.producto;
  }

  CRUD(body: any): Observable<IUnificacionAporteProductoResponse> {
    return this.http.post<IUnificacionAporteProductoResponse>(
      `${this.environmentService.api}/abmunificacionaportes`,
      body,
      httpOptions
    );
  }
}
// * interface para guardar producto y subproducto
interface producto {
  codigo_producto: number;
  descripcion_producto: string;
  codigo_producto_sub: number;
  descripcion_producto_sub: string;
}

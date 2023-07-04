import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IMotivoMovimientoProducto,
  IMotivoMovimientoProductoResponse,
} from '../models/motivo-movimiento-producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MotivoMovimientoProductoService {
  private movimiento: IMotivoMovimientoProducto;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public set(movimiento: IMotivoMovimientoProducto): void {
    this.movimiento = movimiento;
  }

  public get(): IMotivoMovimientoProducto {
    return this.movimiento;
  }

  CRUD(body: string): Observable<IMotivoMovimientoProductoResponse> {
    return this.http.post<IMotivoMovimientoProductoResponse>(
      `${this.environmentService.api}/abmmotivomovimientoxproducto`,
      body,
      httpOptions
    );
  }
}

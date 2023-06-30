import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IProducto, IProductoResponse } from '../models/producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private product: IProducto;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public get(): IProducto {
    return this.product;
  }

  public set(product: IProducto): void {
    this.product = product;
  }

  CRUD(body: string): Observable<IProductoResponse> {
    return this.http.post<IProductoResponse>(
      `${this.environmentService.api}/abmproductos`,
      body,
      httpOptions
    );
  }
}

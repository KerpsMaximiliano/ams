import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IProductoResponse } from '../models/producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getProductoCRUD(body: string): Observable<IProductoResponse> {
    return this.http.post<IProductoResponse>(
      `${this.environmentService.api}/abmproductos`,
      body,
      httpOptions
    );
  }
}

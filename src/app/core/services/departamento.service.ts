import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import {
  IDepartamento,
  IDepartamentoResponse,
} from '../models/departamento.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  URL: string = '/abmdepartamentos';

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  departamentoCRUD(
    body: string
  ): Observable<IDepartamentoResponse | IDepartamento> {
    return this.http.post<IDepartamentoResponse>(
      `${this.environmentService.api}` + this.URL,
      body,
      httpOptions
    );
  }
}

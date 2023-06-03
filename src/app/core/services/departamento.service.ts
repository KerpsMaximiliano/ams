import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IDepartamentoResponse } from '../models/departamento.interface';

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

  CRUD(body: string): Observable<IDepartamentoResponse> {
    return this.http.post<IDepartamentoResponse>(
      `${this.environmentService.api}` + this.URL,
      body,
      httpOptions
    );
  }
}

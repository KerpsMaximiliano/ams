import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { ILocalidadResponse } from '../models/localidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LocalidadService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<ILocalidadResponse> {
    return this.http.post<ILocalidadResponse>(
      `${this.environmentService.api}/abmlocalidades`,
      body,
      httpOptions
    );
  }
}

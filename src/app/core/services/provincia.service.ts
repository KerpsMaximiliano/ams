import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IProvinciaResponse } from '../models/provincia.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  URL: string = '/abmprovincias';
  get provinciaList(): any {
    return this.CRUD(
      JSON.stringify({
        par_modo: 'C',
        nombre_provincia: '',
      })
    );
  }

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IProvinciaResponse> {
    return this.http.post<IProvinciaResponse>(
      `${this.environmentService.api}` + this.URL,
      body,
      httpOptions
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProvincia, IProvinciaResponse } from '../models/provincia.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  URL: string = '/abmprovincias';
  get provinciaList(): any {
    return this.provinciaCRUD(
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

  provinciaCRUD(body: string): Observable<IProvinciaResponse | IProvincia> {
    return this.http.post<IProvinciaResponse | IProvincia>(
      `${this.environmentService.api}` + this.URL,
      body,
      httpOptions
    );
  }
}

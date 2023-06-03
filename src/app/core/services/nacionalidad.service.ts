import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { INacionalidadResponse } from '../models/nacionalidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class NacionalidadService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<INacionalidadResponse> {
    return this.http.post<INacionalidadResponse>(
      `${this.environmentService.api}/abmnacionalidades`,
      body,
      httpOptions
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { EstadoCivilResponse } from '../models/estado-civil';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EstadoCivilService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getEstadoCivilCRUD(body: string): Observable<EstadoCivilResponse> {
    return this.http.post<EstadoCivilResponse>(
      `${this.environmentService.api}/abmestadocivil`,
      body,
      httpOptions
    );
  }
}

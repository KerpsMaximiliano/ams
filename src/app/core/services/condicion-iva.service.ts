import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { ICondicionIvaResponse } from '../models/condicion-iva.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CondicionIvaService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<ICondicionIvaResponse> {
    return this.http.post<ICondicionIvaResponse>(
      `${this.environmentService.api}/abmcondicioniva`,
      body,
      httpOptions
    );
  }
}

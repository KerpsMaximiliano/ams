import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { ITipoDocumentoResponse } from '../models/tipo-documento.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<ITipoDocumentoResponse> {
    return this.http.post<ITipoDocumentoResponse>(
      `${this.environmentService.api}/abmtipodocumento`,
      body,
      httpOptions
    );
  }
}

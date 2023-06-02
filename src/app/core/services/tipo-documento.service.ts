import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  ITipoDocumento,
  ITipoDocumentoResponse,
} from '../models/tipo-documento.interface';

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

  getDocumentByDesc(body: string): Observable<ITipoDocumentoResponse> {
    console.log(body);
    return this.http.post<ITipoDocumentoResponse>(
      `${this.environmentService.api}/abmtipodocumento`,
      body,
      httpOptions
    );
  }

  getDocumentById(body: string): Observable<ITipoDocumentoResponse> {
    return this.http.post<ITipoDocumentoResponse>(
      `${this.environmentService.api}/abmtipodocumento`,
      body,
      httpOptions
    );
  }

  addDocument(data: ITipoDocumento): Observable<ITipoDocumento> {
    let body = JSON.stringify(data);
    return this.http.post<ITipoDocumento>(
      `${this.environmentService.api}/abmtipodocumento`,
      body,
      httpOptions
    );
  }

  editDocument(data: ITipoDocumento): Observable<ITipoDocumento> {
    let body = JSON.stringify(data);
    return this.http.post<ITipoDocumento>(
      `${this.environmentService.api}/abmtipodocumento`,
      body,
      httpOptions
    );
  }

  deleteParametro(id: number) {
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }
}

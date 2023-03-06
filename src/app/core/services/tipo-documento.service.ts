import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDocumento, TipoDocumentoResponse } from '../models/tipo-documento';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getDocumentByDesc(body:string): Observable<TipoDocumentoResponse> {
    return this.http.post<TipoDocumentoResponse>(`${this.environmentService.api}/tiposdedocumentos`, body, httpOptions);
  }

  getDocumentById(body:string): Observable<TipoDocumentoResponse> {
    return this.http.post<TipoDocumentoResponse>(`${this.environmentService.api}/tipodedocumento`, body, httpOptions);
  }
  
  addDocument(body:string): Observable<TipoDocumento>{
    return this.http.post<TipoDocumento>(`${this.environmentService.api}/abmtipodocumento`, body, httpOptions);
  }

  editDocument(data:TipoDocumento): Observable<TipoDocumento> {
    let body = JSON.stringify(data);
    return this.http.put<TipoDocumento>(`${this.environmentService.api}/abmtipodocumento`, body, httpOptions);
  }

  deleteParametro(id:number){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }
}

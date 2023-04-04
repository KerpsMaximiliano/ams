import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CondicionIva, CondicionIvaResponse } from '../models/tipo-condicion-iva.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class CondicionIvaService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getDocumentByDesc(body:string): Observable<CondicionIvaResponse> {
    return this.http.post<CondicionIvaResponse>(`${this.environmentService.api}/tiposcondicioniva`, body, httpOptions);
  }

  getDocumentById(body:string): Observable<CondicionIvaResponse> {
    return this.http.post<CondicionIvaResponse>(`${this.environmentService.api}/tipocondicioniva`, body, httpOptions);
  }
  
  addDocument(data:CondicionIva): Observable<CondicionIva>{
    let body = JSON.stringify(data);
    return this.http.post<CondicionIva>(`${this.environmentService.api}/abmcondicioniva`, body, httpOptions);
  }

  editDocument(data:CondicionIva): Observable<CondicionIva> {
    let body = JSON.stringify(data);
    return this.http.post<CondicionIva>(`${this.environmentService.api}/abmcondicioniva`, body, httpOptions);
  }

  deleteParametro(id:number){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObraSocial, ObraSocialResponse } from '../models/obra-social.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getDocumentByDesc(body:string): Observable<ObraSocialResponse> {
    return this.http.post<ObraSocialResponse>(`${this.environmentService.api}/abmobrasocial`, body, httpOptions);
  }

  getDocumentById(body:string): Observable<ObraSocialResponse> {
    return this.http.post<ObraSocialResponse>(`${this.environmentService.api}/abmobrasocial`, body, httpOptions);
  }
  
  addDocument(data:ObraSocial): Observable<ObraSocial>{
    let body = JSON.stringify(data);
    return this.http.post<ObraSocial>(`${this.environmentService.api}/abmobrasocial`, body, httpOptions);
  }

  editDocument(data:ObraSocial): Observable<ObraSocial> {
    let body = JSON.stringify(data);
    return this.http.post<ObraSocial>(`${this.environmentService.api}/abmobrasocial`, body, httpOptions);
  }

  deleteParametro(id:number){
    return this.http.delete(`${this.environmentService.api}/abmobrasocial/${id}`);
  }
}

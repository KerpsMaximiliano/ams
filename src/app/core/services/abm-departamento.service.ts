import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbmDepartamento , AbmDepartamentoResponse } from '../models/abm-departamento';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  
  URL: string = '/abmdepartamentos';

  constructor(private http: HttpClient, private environmentService: EnvironmentService) { }  

  getDeparByDesc(body:string): Observable<AbmDepartamentoResponse> {
    return this.http.post<AbmDepartamentoResponse>(`${this.environmentService.api}`+this.URL, body, httpOptions);
  }
  
  addDepar(data:AbmDepartamento): Observable<AbmDepartamento> {
    let body = JSON.stringify(data);
    return this.http.post<AbmDepartamento>(`${this.environmentService.api}`+this.URL, body, httpOptions);
  }

  editDepar(data:AbmDepartamento): Observable<AbmDepartamento> {
    let body = JSON.stringify(data);
    return this.http.post<AbmDepartamento>(`${this.environmentService.api}`+this.URL, body, httpOptions);
  }
}
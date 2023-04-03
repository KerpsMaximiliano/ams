import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getDeparByDesc(body:string): Observable<AbmDepartamentoResponse> {
    console.log(body);
    return this.http.post<AbmDepartamentoResponse>(`${this.environmentService.api}/abmDepartamentos`, body, httpOptions);
  }

  getDeparById(body:string): Observable<AbmDepartamentoResponse> {
    return this.http.post<AbmDepartamentoResponse>(`${this.environmentService.api}/departamento`, body, httpOptions);
  }
  
  addDepar(data:AbmDepartamento): Observable<AbmDepartamento>{
    let body = JSON.stringify(data);
    return this.http.post<AbmDepartamento>(`${this.environmentService.api}/abmDepartamento`, body, httpOptions);
  }

  editDepar(data:AbmDepartamento): Observable<AbmDepartamento> {
    let body = JSON.stringify(data);
    return this.http.post<AbmDepartamento>(`${this.environmentService.api}/abmDepartamento`, body, httpOptions);
  }

  deleteDepart(id:number){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }
}

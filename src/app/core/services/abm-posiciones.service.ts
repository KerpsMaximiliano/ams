import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbmPosiciones , AbmPosicionesResponse } from '../models/abm-posiciones';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class PosicionesService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getPosicionByDesc(body:string): Observable<AbmPosicionesResponse> {
    console.log(body);
    return this.http.post<AbmPosicionesResponse>(`${this.environmentService.api}/abmPosiciones`, body, httpOptions);
  }

  getPosicionById(body:string): Observable<AbmPosicionesResponse> {
    return this.http.post<AbmPosicionesResponse>(`${this.environmentService.api}/posiciones`, body, httpOptions);
  }
  
  addPosicion(data:AbmPosiciones): Observable<AbmPosiciones>{
    let body = JSON.stringify(data);
    return this.http.post<AbmPosiciones>(`${this.environmentService.api}/abmPosiciones`, body, httpOptions);
  }

  editPosicion(data:AbmPosiciones): Observable<AbmPosiciones> {
    let body = JSON.stringify(data);
    return this.http.post<AbmPosiciones>(`${this.environmentService.api}/abmPosiciones`, body, httpOptions);
  }

  deletePosicion(id:number){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }
}

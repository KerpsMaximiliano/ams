import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Nacionalidad } from '../models/nacionalidad';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class NacionalidadService {

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getParamByDesc(body:string): Observable<Nacionalidad[]> {  
    console.log(body);
      
    return this.http.post<Nacionalidad[]>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions)
  }

  public deleteEstado(id:number) {
    return this.http.delete(`${this.environmentService.api}/estados/${id}`);
  }

  public addNacionalidad(data:Nacionalidad): Observable<Nacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<Nacionalidad>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions);
  }

  public editNacionalidad(data:Nacionalidad): Observable<Nacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<Nacionalidad>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoNacionalidad } from '../models/tipo-nacionalidad';
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

  getParamByDesc(body:string): Observable<TipoNacionalidad[]> {    
    return this.http.post<TipoNacionalidad[]>(`${this.environmentService.api}/nacionalidades`, body, httpOptions)
  }

  getParamById(body:string): Observable<TipoNacionalidad[]> {    
    return this.http.post<TipoNacionalidad[]>(`${this.environmentService.api}/nacionalidad`, body, httpOptions)
  }

  public deleteEstado(id:number) {
    return this.http.delete(`${this.environmentService.api}/estados/${id}`);
  }

  public addNacionalidad(data:TipoNacionalidad): Observable<TipoNacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<TipoNacionalidad>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions);
  }

  public editNacionalidad(data:TipoNacionalidad): Observable<TipoNacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<TipoNacionalidad>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions);
  }
}

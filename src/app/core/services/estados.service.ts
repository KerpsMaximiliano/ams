import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoNacionalidad } from '../models/tipo-nacionalidad';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

    getParamByDesc(body:string): Observable<TipoNacionalidad[]> {    
      return this.http.post<TipoNacionalidad[]>(`${this.environmentService.api}/nacionalidades`, body, httpOptions)
    }
  
    getParamById(body:string): Observable<TipoNacionalidad[]> {    
      return this.http.post<TipoNacionalidad[]>(`${this.environmentService.api}/nacionalidad`, body, httpOptions)
    }

  public getEstados(pageNumber:number, pageSize:number, description?:string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', pageNumber);
    queryParams = queryParams.append('size', pageSize);
    if (description) {
      queryParams = queryParams.append('descripcion', description);
    }

    return this.http.get(`${this.environmentService.api}/estados`, { params: queryParams})
  }

  public deleteEstado(id:number){
    return this.http.delete(`${this.environmentService.api}/estados/${id}`);
  }

  public addEstado(description:string){
    return this.http.post(`${this.environmentService.api}/abmnacionalidades`, {descripcion: description});
  }

  public editEstado(state:TipoNacionalidad): Observable<TipoNacionalidad> {
    let body = JSON.stringify(state);
    console.log(body);
    return this.http.post<TipoNacionalidad>(`${this.environmentService.api}/abmnacionalidades`, body, httpOptions);
  }
}

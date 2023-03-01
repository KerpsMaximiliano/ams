import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from '../models/tipo-documento';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ParametrosService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getParamByDesc(body:string): Observable<TipoDocumento[]> {    
    return this.http.post<TipoDocumento[]>(`${this.environmentService.api}/tiposdedocumentos`, body, httpOptions)
  }

  getParamById(body:string): Observable<TipoDocumento[]> {    
    return this.http.post<TipoDocumento[]>(`${this.environmentService.api}/tipodedocumento`, body, httpOptions)
  }

  public getParametros(pageNumber:number, pageSize:number, description?:string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', pageNumber);
    queryParams = queryParams.append('size', pageSize);
    if (description) {
      queryParams = queryParams.append('descripcion', description);
    }

    return this.http.get(`${this.environmentService.api}/parametros`, { params: queryParams})
  }

  public deleteParametro(id:number|string){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }

  public addParametro(description:string){
    return this.http.post(`${this.environmentService.api}/parametros`, {descripcion: description});
  }

  public editParametro(state:TipoDocumento): Observable<TipoDocumento> {
    let body = JSON.stringify(state);
    return this.http.put<TipoDocumento>(`${this.environmentService.api}/modificartipodocumento`, body, httpOptions);
  }
}

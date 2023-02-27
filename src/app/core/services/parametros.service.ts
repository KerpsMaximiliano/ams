import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from '../models/tipo-documento';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  public getAllParametros() {
    return this.http.get(environment.api + '')
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

  public deleteParametro(id:number){
    return this.http.delete(`${this.environmentService.api}/parametros/${id}`);
  }

  public addParametro(description:string){
    return this.http.post(`${this.environmentService.api}/parametros`, {descripcion: description});
  }

  public editParametro(state:TipoDocumento) {
    return this.http.put(`${this.environmentService.api}/parametros/${state.id}`, {descripcion: state.tipo});
  }
}

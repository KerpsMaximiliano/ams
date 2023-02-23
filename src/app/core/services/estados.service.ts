import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Estado } from '../models/estado';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  public getAllEstados() {
    return this.http.get(environment.api + '/estados/obtenerTodos')
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
    return this.http.post(`${this.environmentService.api}/estados`, {descripcion: description});
  }

  public editEstado(state:Estado) {
    return this.http.put(`${this.environmentService.api}/estados/${state.id}`, {descripcion: state.descripcion});
  }
}

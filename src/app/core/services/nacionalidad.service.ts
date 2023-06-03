import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { INacionalidad } from '../models/nacionalidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class NacionalidadService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getParamByDesc(body: string): Observable<INacionalidad[]> {
    return this.http.post<INacionalidad[]>(
      `${this.environmentService.api}/abmnacionalidades`,
      body,
      httpOptions
    );
  }

  public deleteEstado(id: number) {
    return this.http.delete(`${this.environmentService.api}/estados/${id}`);
  }

  public addNacionalidad(data: INacionalidad): Observable<INacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<INacionalidad>(
      `${this.environmentService.api}/abmnacionalidades`,
      body,
      httpOptions
    );
  }

  public editNacionalidad(data: INacionalidad): Observable<INacionalidad> {
    let body = JSON.stringify(data);
    return this.http.post<INacionalidad>(
      `${this.environmentService.api}/abmnacionalidades`,
      body,
      httpOptions
    );
  }
}

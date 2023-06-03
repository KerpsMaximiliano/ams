import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { ILocalidad } from '../models/localidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LocalidadService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string | number): Observable<ILocalidad[]> {
    console.log(body);
    return this.http.post<ILocalidad[]>(
      `${this.environmentService.api}/abmlocalidades`,
      body,
      httpOptions
    );
  }

  public getZona(data: any): Observable<any> {
    let body = JSON.stringify(data);
    return this.http.post<any>(
      `${this.environmentService.api}/abmlocalidades`,
      body,
      httpOptions
    );
  }

  public getDepart(data: any): Observable<any> {
    let body = JSON.stringify(data);
    return this.http.post<any>(
      `${this.environmentService.api}/abmdepartamentos`,
      body,
      httpOptions
    );
  }

  public getProvincia(data: any): Observable<any> {
    let body = JSON.stringify(data);
    return this.http.post<any>(
      `${this.environmentService.api}/abmprovincias`,
      body,
      httpOptions
    );
  }
}

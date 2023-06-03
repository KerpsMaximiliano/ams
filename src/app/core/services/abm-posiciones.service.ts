import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPosicion, IPosicionesResponse } from '../models/posicion.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PosicionesService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getCRUD(body: string): Observable<IPosicionesResponse> {
    console.log(body);
    return this.http.post<IPosicionesResponse>(
      `${this.environmentService.api}/abmposiciones`,
      body,
      httpOptions
    );
  }

  getProv(body: any): Observable<IPosicionesResponse> {
    console.log(body);
    return this.http.post<IPosicionesResponse>(
      `${this.environmentService.api}/abmprovincias`,
      body,
      httpOptions
    );
  }

  public getLocal(data: any): Observable<any> {
    let body = data;
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
}

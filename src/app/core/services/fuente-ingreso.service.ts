import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IFuenteIngreso, IFuenteIngresoResponse } from '../models/fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FuenteIngresoService {
  fuenteIngreso: IFuenteIngreso;
  back: boolean=false;
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  set(fuente_ingreso: IFuenteIngreso) {
    this.fuenteIngreso = fuente_ingreso;
  }

  get() {
    return this.fuenteIngreso;
  }

  public getBack(): boolean{
    return this.back;
  }

  public setBack(value: boolean): void {
    this.back = value;
  }

  CRUD(body: string): Observable<IFuenteIngresoResponse> {
    return this.http.post<IFuenteIngresoResponse>(
      `${this.environmentService.api}/abmfuenteingresos`,
      body,
      httpOptions
    );
  }
}

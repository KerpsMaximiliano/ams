import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IFuenteIngreso,
  IFuenteIngresoResponse,
} from '../models/fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FuenteIngresoService {
  private redirecting: boolean = false;
  private back: boolean = false;
  private fuenteIngreso: IFuenteIngreso;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public get(): IFuenteIngreso {
    return this.fuenteIngreso;
  }

  public set(fuenteIngreso: IFuenteIngreso): void {
    this.fuenteIngreso = fuenteIngreso;
  }

  public getRoute(): boolean {
    return this.redirecting;
  }

  public setRoute(value: boolean): void {
    this.redirecting = value;
  }

  public getBack(): boolean {
    return this.back;
  }

  public setBack(value: boolean): void {
    this.back = value;
  }

  public CRUD(body: string): Observable<IFuenteIngresoResponse> {
    return this.http.post<IFuenteIngresoResponse>(
      `${this.environmentService.api}/abmfuenteingresos`,
      body,
      httpOptions
    );
  }
}

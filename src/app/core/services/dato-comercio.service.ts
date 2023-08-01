import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IDatoComercioResponse,
  ITipoFormaPago,
} from '../models/dato-comercio.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class DatoComercioService {
  private listFormaPago: ITipoFormaPago[];
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public setFormasPago(formaPago: ITipoFormaPago[]) {
    this.listFormaPago = formaPago;
  }

  public getFormasPago(): ITipoFormaPago[] {
    return this.listFormaPago;
  }

  CRUD(body: string): Observable<IDatoComercioResponse> {
    return this.http.post<IDatoComercioResponse>(
      `${this.environmentService.api}/abmdatoscomercio`,
      body,
      httpOptions
    );
  }
}

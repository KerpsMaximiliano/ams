import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { ISubmotivoMovimiento } from '../models/submotivo-movimiento';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class SubmotivoMovimientoService {
  movimiento: ISubmotivoMovimiento;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  // * se guarda el movimiento del CU 22
  set(movimiento: ISubmotivoMovimiento) {
    this.movimiento = movimiento;
  }

  // * se recupera el movimiento del CU 23
  get() {
    return this.movimiento;
  }

  CRUD(body: string): Observable<ISubmotivoMovimiento> {
    return this.http.post<ISubmotivoMovimiento>(
      `${this.environmentService.api}/abmsubmotivos`,
      body,
      httpOptions
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IFormaPagoResponse } from '../models/formas-pago.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FormaPagoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getFormasPagoCRUD(body: string): Observable<IFormaPagoResponse> {
    return this.http.post<IFormaPagoResponse>(
      `${this.environmentService.api}/abmtarjetacredito`,
      body,
      httpOptions
    );
  }
}

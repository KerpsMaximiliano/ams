import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IFormasPagoResponse } from '../models/formas-pago.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FormasPagoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getFormasPagoCRUD(body: string): Observable<IFormasPagoResponse> {
    return this.http.post<IFormasPagoResponse>(
      `${this.environmentService.api}/abmtarjetacredito`,
      body,
      httpOptions
    );
  }
}

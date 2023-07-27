import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IMontoMinimoResponse } from '../models/monto-minimo.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class MontoMinimoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IMontoMinimoResponse> {
    return this.http.post<IMontoMinimoResponse>(
      `${this.environmentService.api}/abmmontominimo`,
      body,
      httpOptions
    );
  }
}

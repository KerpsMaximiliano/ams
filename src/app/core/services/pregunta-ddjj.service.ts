import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IPreguntaDDJJResponse } from '../models/pregunta-ddjj.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PreguntaDDJJService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IPreguntaDDJJResponse> {
    return this.http.post<IPreguntaDDJJResponse>(
      `${this.environmentService.api}/abmpreguntasddjj`,
      body,
      httpOptions
    );
  }
}

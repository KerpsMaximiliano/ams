import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { PreguntasDDJJ, PreguntasDDJJResponse } from '../models/preguntas-ddjj';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PreguntasDDJJService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  getPreguntasDDJJCRUD(
    body: string
  ): Observable<PreguntasDDJJResponse | PreguntasDDJJ> {
    return this.http.post<PreguntasDDJJResponse>(
      `${this.environmentService.api}/abmpreguntasddjj`,
      body,
      httpOptions
    );
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IPreguntasDDJJ,
  IPreguntasDDJJResponse,
} from '../models/preguntas-ddjj.interface';

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
  ): Observable<IPreguntasDDJJResponse | IPreguntasDDJJ> {
    return this.http.post<IPreguntasDDJJResponse>(
      `${this.environmentService.api}/abmpreguntasddjj`,
      body,
      httpOptions
    );
  }
}

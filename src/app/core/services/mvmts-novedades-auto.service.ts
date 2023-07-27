import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MvmtsNovedadesAutoResponse } from '../models/mvmts-novedades-auto.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class MvmtsNovedadesAutoService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<MvmtsNovedadesAutoResponse> {
    return this.http.post<MvmtsNovedadesAutoResponse>(
      `${this.environmentService.api}/abmmovimientosnovauto`,
      body,
      httpOptions
    );
  }
}

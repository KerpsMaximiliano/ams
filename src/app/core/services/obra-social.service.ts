import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IObraSocialResponse } from '../models/obra-social.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ObraSocialService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IObraSocialResponse> {
    return this.http.post<IObraSocialResponse>(
      `${this.environmentService.api}/abmobrasocial`,
      body,
      httpOptions
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IEntidad, IEntidadResponse } from '../models/entidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  private entidad: IEntidad[];

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  public setEntidad(provincias: IEntidad[]): void {
    this.entidad = provincias;
  }

  public getEntidad(): IEntidad[] {
    return this.entidad;
  }

  public CRUD(body: string): Observable<IEntidadResponse> {
    return this.http.post<IEntidadResponse>(
      `${this.environmentService.api}/abmtambos`,
      body,
      httpOptions
    );
  }
}

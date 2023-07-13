import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IProvincia, IProvinciaResponse } from '../models/provincia.interface';
import { IEnvio, IPromocion } from '../models/localidad.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private provincias: IProvincia[];
  private envios: IEnvio[];
  private promociones: IPromocion[];

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IProvinciaResponse> {
    return this.http.post<IProvinciaResponse>(
      `${this.environmentService.api}/abmprovincias`,
      body,
      httpOptions
    );
  }

  public getEnvios(): IEnvio[]{
    return this.envios;
  }

  public setEnvios(envios: IEnvio[]){
    this.envios = envios;
  }

  public getPromociones(): IPromocion[]{
    return this.promociones;
  }

  public setPromociones(promociones: IPromocion[]){
    this.promociones = promociones;
  }

  public setProvincias(provincias: IProvincia[]): void {
    this.provincias = provincias;
  }

  public getProvincias(): IProvincia[] {
    return this.provincias;
  }
}

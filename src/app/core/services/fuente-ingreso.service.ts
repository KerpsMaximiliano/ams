import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { FuenteIngreso, FuenteIngresoResponse } from '../models/fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class FuenteIngresoService {
  
  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

    fuenteIngresoCRUD(body:string): Observable<FuenteIngreso> {
    return this.http.post<FuenteIngreso>(`${this.environmentService.api}/abmfuenteingresos`, body, httpOptions);
  }
}
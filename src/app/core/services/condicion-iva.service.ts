import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CondicionIvaResponse } from '../models/condicion-iva.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class CondicionIvaService { 

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getCondicionIvaCRUD(body:string): Observable<CondicionIvaResponse> {
    return this.http.post<CondicionIvaResponse>(`${this.environmentService.api}/abmcondicioniva`, body, httpOptions);
  }
}

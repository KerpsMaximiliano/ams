import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObraSocial, ObraSocialResponse } from '../models/obra-social.interface';
import { EnvironmentService } from './environment.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {

  constructor(private http:HttpClient,
    private environmentService: EnvironmentService) { }

  getObraSocialCrud(body:string): Observable<ObraSocialResponse> {
    return this.http.post<ObraSocialResponse>(`${this.environmentService.api}/abmobrasocial`, body, httpOptions);
  }
}

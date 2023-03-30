import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoProvincia } from '../models/tipo-provincia';
import { EnvironmentService } from './environment.service';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
    providedIn: 'root'
})
export class ProvinciaService {

    constructor(private http:HttpClient,
        private environmentService: EnvironmentService) { }

    getParamByDesc(body:string): Observable<TipoProvincia[]> {  
        console.log(body);
        return this.http.post<TipoProvincia[]>(`${this.environmentService.api}/provincias`, body, httpOptions)
    }

    getParamById(body:string): Observable<TipoProvincia[]> {    
        console.log(body);
        return this.http.post<TipoProvincia[]>(`${this.environmentService.api}/provincia`, body, httpOptions)
    }

    public deleteEstado(id:number) {
        return this.http.delete(`${this.environmentService.api}/estados/${id}`);
    }

    public addProvincia(data:TipoProvincia): Observable<TipoProvincia> {
        let body = JSON.stringify(data);
        return this.http.post<TipoProvincia>(`${this.environmentService.api}/abmprovincias`, body, httpOptions);
    }

    public editProviType(data:TipoProvincia): Observable<TipoProvincia> {
        let body = JSON.stringify(data);
        return this.http.post<TipoProvincia>(`${this.environmentService.api}/abmprovincias`, body, httpOptions);
    }
}

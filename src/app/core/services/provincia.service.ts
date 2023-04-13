import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from '../models/provincia';
import { EnvironmentService } from './environment.service';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
    providedIn: 'root'
})
export class ProvinciaService {

    constructor(private http:HttpClient, private environmentService: EnvironmentService) { }

    getProvinciaByDesc(body:string): Observable<Provincia[]> {  
        console.log(body);
        return this.http.post<Provincia[]>(`${this.environmentService.api}/provincias`, body, httpOptions)
    }

    getProvinciaById(body:string): Observable<Provincia[]> {    
        console.log(body);
        return this.http.post<Provincia[]>(`${this.environmentService.api}/provincia`, body, httpOptions)
    }

    public addProvincia(data:Provincia): Observable<Provincia> {
        let body = JSON.stringify(data);
        return this.http.post<Provincia>(`${this.environmentService.api}/abmprovincias`, body, httpOptions);
    }

    public editProvincia(data:Provincia): Observable<Provincia> {
        let body = JSON.stringify(data);
        return this.http.post<Provincia>(`${this.environmentService.api}/abmprovincias`, body, httpOptions);
    }
}
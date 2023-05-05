import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbmLocalidades } from '../models/abm-localidades';
import { EnvironmentService } from './environment.service';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
}
@Injectable({
    providedIn: 'root'
})
export class LocalidadesService {

    constructor(private http:HttpClient,
        private environmentService: EnvironmentService) { }

    getParamByDesc(body:string): Observable<AbmLocalidades[]> {  
        console.log(body);
        return this.http.post<AbmLocalidades[]>(`${this.environmentService.api}/abmlocalidades`, body, httpOptions)
    }

    getParamById(body:string): Observable<AbmLocalidades[]> {    
        console.log(body);
        return this.http.post<AbmLocalidades[]>(`${this.environmentService.api}/abmlocalidades`, body, httpOptions)
    }

    public getZona (data:any): Observable<any> {
        let body = JSON.stringify(data);
        return this.http.post<any>(`${this.environmentService.api}/abmlocalidades`, body, httpOptions);
    }

    public deleteEstado(id:number) {
        return this.http.delete(`${this.environmentService.api}/estados/${id}`);
    }

    public addLocalidad(data:AbmLocalidades): Observable<AbmLocalidades> {
        let body = JSON.stringify(data);
        return this.http.post<AbmLocalidades>(`${this.environmentService.api}/abmlocalidades`, body, httpOptions);
    }

    public editLocalType(data:AbmLocalidades): Observable<AbmLocalidades> {
        let body = JSON.stringify(data);
        return this.http.post<AbmLocalidades>(`${this.environmentService.api}/abmlocalidades`, body, httpOptions);
    }

    public getDepart (data:any): Observable<any> {
        let body = JSON.stringify(data);
        return this.http.post<any>(`${this.environmentService.api}/abmdepartamentos`, body, httpOptions);
    }
    
    public getProvincia (data:any): Observable<any> {
        let body = JSON.stringify(data);
        return this.http.post<any>(`${this.environmentService.api}/abmprovincias`, body, httpOptions);
    }
}

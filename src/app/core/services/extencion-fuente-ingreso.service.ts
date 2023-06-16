import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// * Services
import { EnvironmentService } from './environment.service';

// * Interfaces
import { IExtencionFuenteIngreso } from '../models/extencion-fuente-ingreso.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
let name1 = {
  par_modo: 'C',
  vigencia: '1',
  fuenteingreso: '1',
  producto: '1',
  producto_cod: '1',
  remuneracionDesde: '1',
  remuneracionHasta: '1',
  coeficiente1: 1,
  coeficiente2: 1,
  coeficiente3: 1,
  coeficiente4: 1,
  coeficiente5: 1,
};
let name2 = {
  par_modo: 'C',
  vigencia: '1',
  fuenteingreso: '1',
  producto: '1',
  producto_cod: '1',
  remuneracionDesde: '1',
  remuneracionHasta: '1',
  coeficiente1: 1,
  coeficiente2: 1,
  coeficiente3: 1,
  coeficiente4: 1,
  coeficiente5: 1,
};
let name3 = {
  par_modo: 'C',
  vigencia: '1',
  fuenteingreso: '1',
  producto: '1',
  producto_cod: '1',
  remuneracionDesde: '1',
  remuneracionHasta: '1',
  coeficiente1: 1,
  coeficiente2: 1,
  coeficiente3: 1,
  coeficiente4: 1,
  coeficiente5: 1,
};
let name4 = {
  par_modo: 'C',
  vigencia: '1',
  fuenteingreso: '1',
  producto: '1',
  producto_cod: '1',
  remuneracionDesde: '1',
  remuneracionHasta: '1',
  coeficiente1: 1,
  coeficiente2: 1,
  coeficiente3: 1,
  coeficiente4: 1,
  coeficiente5: 1,
};

@Injectable({
    providedIn: 'root',
})
export class ExtencionFuenteIngresoService {
    fuenteIngreso: {fuenteIngreso: string, codigo: number};
    constructor(
        private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  CRUD(body: string): Observable<IExtencionFuenteIngreso> {
    return this.http.post<IExtencionFuenteIngreso>(
      `${this.environmentService.api}/abmextencionfuenteingreso`,
        body,
      httpOptions
    );
  }

  setFuenteIngreso(fuente_ingreso:{fuenteIngreso: string, codigo: number}){
    this.fuenteIngreso = fuente_ingreso;
  }

  getFuenteIngreso(){
    return this.fuenteIngreso;
  }

  getprueba(body: string): IExtencionFuenteIngreso[] {
    return [name1, name2, name3, name4];
  }
}

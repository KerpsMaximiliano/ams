import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// * Serivices
import { EnvironmentService } from './environment.service';

// * Interfaces
import {
  IParentesco,
  IParentescoProductoResponse,
} from '../models/parentesco-producto.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ParentescoProductoService {
  private parentescos: IParentesco[];

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
    let data = [
      {
        codigo: 0,
        descripcion: 'Titular',
      },
      {
        codigo: 1,
        descripcion: 'Cónyuge',
      },
      {
        codigo: 2,
        descripcion: 'Concubino/a',
      },
      {
        codigo: 3,
        descripcion: 'Hijo soltero menor de 21 años',
      },
      {
        codigo: 4,
        descripcion: 'Hijo soltero de 21 a 25 años cursando estudios regulares',
      },
      {
        codigo: 5,
        descripcion: 'Hijo del cónyuge soltero menor de 21 años',
      },
      {
        codigo: 6,
        descripcion:
          'Hijo del cónyuge soltero de 21 a 25 años cursando estudios regulares',
      },
      {
        codigo: 7,
        descripcion: 'Menor bajo guarda o tutela',
      },
      {
        codigo: 8,
        descripcion: 'Familiar a cargo',
      },
      {
        codigo: 9,
        descripcion: 'Mayor de 25 años discapacitado',
      },
    ];
    this.set(data);
  }

  public get(): IParentesco[] {
    return this.parentescos;
  }

  public set(parentesco: IParentesco[]): void {
    this.parentescos = parentesco;
  }

  CRUD(body: string): Observable<IParentescoProductoResponse> {
    return this.http.post<IParentescoProductoResponse>(
      `${this.environmentService.api}/abmparentescos`,
      body,
      httpOptions
    );
  }
}

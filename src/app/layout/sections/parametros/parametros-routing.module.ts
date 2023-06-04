import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
// 01 - PROVINCIAS
import { ProvinciaComponent } from './provincia/provincia.component';
// 02 - TIPOS DE DOCUMENTO
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
// 03 - NACIONALIDADES
import { NacionalidadComponent } from './nacionalidad/nacionalidad.component';
// 04 - DEPARTAMENTOS
import { DepartamentoComponent } from './departamento/departamento.component';
// 05 - POSICIONES
import { PosicionComponent } from './posicion/posicion.component';
// 06 - LOCALIDADES
import { LocalidadComponent } from './localidad/localidad.component';
// 07 - FORMAS DE PAGO
import { FormasPagoComponent } from './formas-pago/formas-pago.component';
// 08 - CONDICIONES DE IVA
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
// 09 - ESTADOS CIVILES
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
// 11 - FUENTES INGRESO
import { FuenteIngresoComponent } from './fuente-ingreso/fuente-ingreso.component';
// 12 - OBRAS SOCIALES
import { ObraSocialComponent } from './obra-social/obra-social.component';
// 13 - PREGUNTAS DE DECLARACIONES JURADS
import { PreguntasDDJJComponent } from './preguntas-ddjj/preguntas-ddjj.component';

const routes: Routes = [
  {
    path: 'parametros/provincias',
    component: ProvinciaComponent,
  },
  {
    path: 'parametros/tipos-documento',
    component: TipoDocumentoComponent,
  },
  {
    path: 'parametros/nacionalidades',
    component: NacionalidadComponent,
  },
  {
    path: 'parametros/departamentos',
    component: DepartamentoComponent,
  },
  {
    path: 'parametros/posiciones',
    component: PosicionComponent,
  },
  {
    path: 'parametros/localidades',
    component: LocalidadComponent,
  },
  {
    path: 'parametros/formas-pago',
    component: FormasPagoComponent,
  },
  {
    path: 'parametros/condiciones-iva',
    component: CondicionIvaComponent,
  },
  {
    path: 'parametros/estados-civiles',
    component: EstadoCivilComponent,
  },
  {
    path: 'parametros/fuentes-ingreso',
    component: FuenteIngresoComponent,
  },
  {
    path: 'parametros/obras-sociales',
    component: ObraSocialComponent,
  },
  {
    path: 'parametros/preguntas-ddjj',
    component: PreguntasDDJJComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosRoutingModule {}

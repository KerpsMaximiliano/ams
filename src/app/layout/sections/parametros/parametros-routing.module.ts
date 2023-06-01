import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
// 01 - PROVINCIA
import { ProvinciaComponent } from './provincia/provincia.component';
// 02 - TIPO DE DOCUMENTO
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
// 03 - NACIONALIDAD
import { NacionalidadComponent } from './nacionalidad/nacionalidad.component';
// 04 - DEPARTAMENTO
import { DepartamentoComponent } from './departamento/departamento.component';
// 05 - POSICIONES
import { AbmPosicionesComponent } from './abm-posiciones/abm-posiciones.component';
// 06 - LOCALIDADES
import { AbmLocalidadesComponent } from './abm-localidades/abm-localidades.component';
// 07 - FORMAS DE PAGO
import { FormasPagoComponent } from './formas-pago/formas-pago.component';
// 08 - CONDICIONES DE IVA
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
// 09 - ESTADO CIVIL
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
// 12 - OBRA SOCIAL
import { ObraSocialComponent } from './obra-social/obra-social.component';
// 13 - PREGUNTAS DDJJ
import { PreguntasDDJJComponent } from './preguntas-ddjj/preguntas-ddjj.component';
// 31 - ATRIBUTOS DE RELACIÓN CAPITA/PLAN
import { AtributosRelacionCapitaPlanComponent } from './atributos-relacion-capita-plan/atributos-relacion-capita-plan.component';

const routes: Routes = [
  {
    path: 'parametros/provincia',
    component: ProvinciaComponent,
  },
  {
    path: 'parametros/tipo-documento',
    component: TipoDocumentoComponent,
  },
  {
    path: 'parametros/nacionalidad',
    component: NacionalidadComponent,
  },
  {
    path: 'parametros/departamento',
    component: DepartamentoComponent,
  },
  {
    path: 'parametros/posicion',
    component: AbmPosicionesComponent,
  },
  {
    path: 'parametros/localidades',
    component: AbmLocalidadesComponent,
  },
  {
    path: 'parametros/formas-pago',
    component: FormasPagoComponent,
  },
  {
    path: 'parametros/condicion-iva',
    component: CondicionIvaComponent,
  },
  {
    path: 'parametros/estado-civil',
    component: EstadoCivilComponent,
  },
  {
    path: 'parametros/obra-social',
    component: ObraSocialComponent,
  },
  {
    path: 'parametros/pregunta-ddjj',
    component: PreguntasDDJJComponent,
  },
  {
    path: 'parametros/atributos-relacion-capita-plan',
    component: AtributosRelacionCapitaPlanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosRoutingModule {}

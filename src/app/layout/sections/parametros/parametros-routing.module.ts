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
// 08 - CONDICIONES DE IVA
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
// 09 - ESTADO CIVIL
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
// 12 - OBRA SOCIAL
import { ObraSocialComponent } from './obra-social/obra-social.component';
// 13 - PREGUNTAS DDJJ
import { PreguntasDDJJComponent } from './preguntas-ddjj/preguntas-ddjj.component';

const routes: Routes = [
  {
    path: 'parametros/provincia',
    component: ProvinciaComponent
  },
  {
    path: 'parametros/tipo-documento',
    component: TipoDocumentoComponent
  },
  {
    path: 'parametros/nacionalidad',
    component: NacionalidadComponent
  },
  {
    path: 'parametros/abm-departamento',
    component: DepartamentoComponent
  },
  {
    path: 'parametros/condicion-iva',
    component: CondicionIvaComponent
  },
  {
    path: 'parametros/estado-civil',
    component: EstadoCivilComponent,
  },
  {
    path: 'parametros/obra-social',
    component: ObraSocialComponent
  },
  {
    path: 'parametros/preguntas-ddjj',
    component: PreguntasDDJJComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

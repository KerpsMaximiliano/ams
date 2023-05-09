import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
// 01 - PROVINCIA
import { ProvinciaComponent } from './provincia/provincia.component';
// 02 - TIPO DE DOCUMENTO
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
// 03 - NACIONALIDAD
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';
// 04 - DEPARTAMENTO
import { DepartamentoComponent } from './departamento/departamento.component';
// 06 - LOCALIDADES
import { AbmLocalidadesComponent } from './abm-localidades/abm-localidades.component';
// 08 - CONDICIONES DE IVA
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
// 09 - ESTADO CIVIL
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
// 12 - OBRA SOCIAL
import { ObraSocialComponent } from './obra-social/obra-social.component';


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
    path: 'parametros/tipo-nacionalidad',
    component: TipoNacionalidadComponent
  },
  {
    path: 'parametros/abm-departamento',
    component: DepartamentoComponent
  },
  {
    path: 'parametros/localidades',
    component: AbmLocalidadesComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

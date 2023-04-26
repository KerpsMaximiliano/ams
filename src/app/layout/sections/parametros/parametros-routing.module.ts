import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoComponent } from './departamento/departamento.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';

const routes: Routes = [
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
    path: 'parametros/provincia',
    component: ProvinciaComponent
  },
  {
    path: 'parametros/obra-social',
    component: ObraSocialComponent
  },
  {
    path: 'parametros/condicion-iva',
    component: CondicionIvaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

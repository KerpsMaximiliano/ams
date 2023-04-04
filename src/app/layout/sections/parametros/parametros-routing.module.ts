import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';
import { CondicionIvaComponent } from './tipo-condicion-iva/tipo-condicion-iva.component';

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
    path: 'parametros/condicion-iva',
    component: CondicionIvaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

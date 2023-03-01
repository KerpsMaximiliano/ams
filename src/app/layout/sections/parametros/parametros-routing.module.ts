import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';

const routes: Routes = [
  {
    path: 'parametros/tipo-documento',
    component: TipoDocumentoComponent
  },
  {
    path: 'parametros/tipo-nacionalidad',
    component: TipoNacionalidadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

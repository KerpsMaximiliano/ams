import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';

const routes: Routes = [
  {
    path: 'parametros/tipo-documento',
    component: TipoDocumentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule { }

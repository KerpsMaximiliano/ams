import { SectionsComponent } from './sections.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SectionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'parametros',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:() => import ('./parametros/parametros.module').then(m => m.ParametrosModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionsRoutingModule { }

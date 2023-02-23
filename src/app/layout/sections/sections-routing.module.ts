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
        redirectTo: 'estados',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:() => import ('./estados/estados.module').then(m => m.EstadosModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
import { SectionsComponent } from './sections.component';

const routes: Routes = [
  {
    path: '',
    component: SectionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'parametros',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./parametros/parametros.module').then(
            (m) => m.ParametrosModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionsRoutingModule {}

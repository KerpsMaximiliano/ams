import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadosRoutingModule } from './estados-routing.module';
import { EstadosComponent } from './estados.component';
import { EstadosFilterComponent } from './components/components/estados-filter/estados-filter.component';
import { EstadosDashboardComponent } from './components/components/estados-dashboard/estados-dashboard.component';
import { AddEditEstadoDialogComponent } from './components/add-edit-estado-dialog/add-edit-estado-dialog.component';


@NgModule({
  declarations: [
    EstadosComponent,
    EstadosFilterComponent,
    EstadosDashboardComponent,
    AddEditEstadoDialogComponent
  ],
  imports: [
    CommonModule,
    EstadosRoutingModule,
    SharedModule
  ]
})
export class EstadosModule { }

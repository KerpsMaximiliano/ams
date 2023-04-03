import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { AddEditTipoDocumentoDialogComponent } from './tipo-documento/components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoDashboardComponent } from './tipo-documento/components/tipo-documento-dashboard/tipo-documento-dashboard.component';
import { TipoDocumentoFilterComponent } from './tipo-documento/components/tipo-documento-filter/tipo-documento-filter.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { EditTipoNacionalidadDialogComponent } from './tipo-nacionalidad/components/edit-tipo-nacionalidad-dialog/edit-tipo-nacionalidad-dialog.component';
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';
import { TipoNacionalidadFilterComponent } from './tipo-nacionalidad/components/tipo-nacionalidad-filter/tipo-nacionalidad-filter.component';
import { TipoNacionalidadDashboardComponent } from './tipo-nacionalidad/components/tipo-nacionalidad-dashboard/tipo-nacionalidad-dashboard.component'; 
import { EditAbmDepartamentoDialogComponent } from './abm-departamento/components/edit-abm-departamento-dialog/edit-abm-departamento-dialog.component';
import { AbmDepartamentoComponent } from './abm-departamento/abm-departamento.component';
import { AbmDepartamentoFilterComponent } from './abm-departamento/components/abm-departamento-filter/abm-departamento-filter.component';
import { AbmDepartamentoDashboardComponent } from './abm-departamento/components/abm-departamento-dashboard/abm-departamento-dashboard.component';

@NgModule({
  declarations: [
    TipoDocumentoComponent,
    TipoDocumentoFilterComponent,
    TipoDocumentoDashboardComponent,
    AddEditTipoDocumentoDialogComponent,
    TipoNacionalidadComponent,
    TipoNacionalidadFilterComponent,
    TipoNacionalidadDashboardComponent,
    EditTipoNacionalidadDialogComponent,
    AbmDepartamentoComponent,
    AbmDepartamentoDashboardComponent,
    AbmDepartamentoFilterComponent,
    EditAbmDepartamentoDialogComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }

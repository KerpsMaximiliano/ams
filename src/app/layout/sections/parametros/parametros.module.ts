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
import { DepartamentoDashboardComponent } from './departamento/components/departamento-dashboard/departamento-dashboard.component';
import { DepartamentoFilterComponent } from './departamento/components/departamento-filter/departamento-filter.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { AddEditDepartamentoDialogComponent } from './departamento/components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import { AddEditProvinciaDialogComponent } from './provincia/components/edit-provincia-dialog/add-edit-provincia-dialog.component';
import { ProvinciaDashboardComponent } from './provincia/components/provincia-dashboard/provincia-dashboard.component';
import { ProvinciaFilterComponent } from './provincia/components/provincia-filter/provincia-filter.component';
import { ProvinciaComponent } from './provincia/provincia.component';

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
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,
    AddEditDepartamentoDialogComponent,
    ProvinciaComponent,
    ProvinciaFilterComponent,
    ProvinciaDashboardComponent,
    AddEditProvinciaDialogComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }

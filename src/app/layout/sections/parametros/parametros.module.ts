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
import { AbmLocalidadesComponent } from './abm-localidades/abm-localidades.component';
import { AbmLocalidadesFilterComponent } from './abm-localidades/components/abm-localidades-filter/abm-localidades-filter.component';
import { AbmLocalidadesDashboardComponent } from './abm-localidades/components/abm-localidades-dashboard/abm-localidades-dashboard.component';
import { EditAbmLocalidadesDialogComponent } from './abm-localidades/components/abm-localidades-dialog/edit-abm-localidades-dialog.component';

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
    AbmLocalidadesComponent,
    AbmLocalidadesFilterComponent,
    AbmLocalidadesDashboardComponent,
    EditAbmLocalidadesDialogComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }

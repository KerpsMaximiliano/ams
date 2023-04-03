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

// Obra Social
import { AddEditObraSocialDialogComponent } from './obra-social/components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialDashboardComponent } from './obra-social/components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocialFilterComponent } from './obra-social/components/obra-social-filter/obra-social-filter.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';

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
    
    // Obra Social
    AddEditObraSocialDialogComponent,
    ObraSocialDashboardComponent,
    ObraSocialFilterComponent,
    ObraSocialComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }

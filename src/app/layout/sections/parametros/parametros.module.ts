import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrosRoutingModule } from './parametros-routing.module';

// ABM condiciones iva
import { AddEditCondicionIvaDialogComponent } from './condicion-iva/components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaDashboardComponent } from './condicion-iva/components/condicion-iva-dashboard/condicion-iva-dashboard.component';
import { CondicionIvaFilterComponent } from './condicion-iva/components/condicion-iva-filter/condicion-iva-filter.component';
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';

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
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,
    AddEditDepartamentoDialogComponent,
    ProvinciaComponent,
    ProvinciaFilterComponent,
    ProvinciaDashboardComponent,
    AddEditProvinciaDialogComponent,
    
    // Obra Social
    AddEditObraSocialDialogComponent,
    ObraSocialDashboardComponent,
    ObraSocialFilterComponent,
    ObraSocialComponent,
    // ABM condicion iva
    AddEditCondicionIvaDialogComponent,
    CondicionIvaDashboardComponent,
    CondicionIvaFilterComponent,
    CondicionIvaComponent
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule
  ]
})
export class ParametrosModule { }

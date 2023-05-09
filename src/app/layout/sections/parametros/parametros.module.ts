import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ParametrosRoutingModule } from './parametros-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


// * Components
// 01 - PROVINCIAS
import { AddEditProvinciaDialogComponent } from './provincia/components/edit-provincia-dialog/add-edit-provincia-dialog.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { ProvinciaDashboardComponent } from './provincia/components/provincia-dashboard/provincia-dashboard.component';
import { ProvinciaFilterComponent } from './provincia/components/provincia-filter/provincia-filter.component';
// 02 - TIPO DE DOCUMENTO
import { AddEditTipoDocumentoDialogComponent } from './tipo-documento/components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoDocumentoDashboardComponent } from './tipo-documento/components/tipo-documento-dashboard/tipo-documento-dashboard.component';
import { TipoDocumentoFilterComponent } from './tipo-documento/components/tipo-documento-filter/tipo-documento-filter.component';
// 03 - NACIONALIDAD
import { EditTipoNacionalidadDialogComponent } from './tipo-nacionalidad/components/edit-tipo-nacionalidad-dialog/edit-tipo-nacionalidad-dialog.component';
import { TipoNacionalidadComponent } from './tipo-nacionalidad/tipo-nacionalidad.component';
import { TipoNacionalidadDashboardComponent } from './tipo-nacionalidad/components/tipo-nacionalidad-dashboard/tipo-nacionalidad-dashboard.component';
import { TipoNacionalidadFilterComponent } from './tipo-nacionalidad/components/tipo-nacionalidad-filter/tipo-nacionalidad-filter.component';
// 04 - DEPARTAMENTO
import { AddEditDepartamentoDialogComponent } from './departamento/components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { DepartamentoDashboardComponent } from './departamento/components/departamento-dashboard/departamento-dashboard.component';
import { DepartamentoFilterComponent } from './departamento/components/departamento-filter/departamento-filter.component';
// 06 - LOCALIDADES
import { EditAbmLocalidadesDialogComponent } from './abm-localidades/components/abm-localidades-dialog/edit-abm-localidades-dialog.component';
import { AbmLocalidadesComponent } from './abm-localidades/abm-localidades.component';
import { AbmLocalidadesDashboardComponent } from './abm-localidades/components/abm-localidades-dashboard/abm-localidades-dashboard.component';
import { AbmLocalidadesFilterComponent } from './abm-localidades/components/abm-localidades-filter/abm-localidades-filter.component';
// 08 - CONDICIONES DE IVA
import { AddEditCondicionIvaDialogComponent } from './condicion-iva/components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
import { CondicionIvaDashboardComponent } from './condicion-iva/components/condicion-iva-dashboard/condicion-iva-dashboard.component';
import { CondicionIvaFilterComponent } from './condicion-iva/components/condicion-iva-filter/condicion-iva-filter.component';
// 09 - ESTADO CIVIL
import { AddEditEstadoCivilDialogComponent } from './estado-civil/components/add-edit-estado-civil-dialog/add-edit-estado-civil-dialog.component';
import { EstadoCivilComponent } from "./estado-civil/estado-civil.component";
import { EstadoCivilDashboardComponent } from './estado-civil/components/estado-civil-dashboard/estado-civil-dashboard.component';
import { EstadoCivilFilterComponent } from './estado-civil/components/estado-civil-filter/estado-civil-filter.component';
// 12 - OBRA SOCIAL
import { AddEditObraSocialDialogComponent } from './obra-social/components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';
import { ObraSocialDashboardComponent } from './obra-social/components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocialFilterComponent } from './obra-social/components/obra-social-filter/obra-social-filter.component';

@NgModule({
  declarations: [
    // 01 - PROVINCIA
    AddEditProvinciaDialogComponent,
    ProvinciaComponent,
    ProvinciaDashboardComponent,
    ProvinciaFilterComponent,

    // 02 - TIPO DE DOCUMENTO
    AddEditTipoDocumentoDialogComponent,
    TipoDocumentoComponent,
    TipoDocumentoDashboardComponent,
    TipoDocumentoFilterComponent,

    // 03 - NACIONALIDAD
    EditTipoNacionalidadDialogComponent,
    TipoNacionalidadComponent,
    TipoNacionalidadDashboardComponent,
    TipoNacionalidadFilterComponent,
    
    // 04 - DEPARTAMENTO
    AddEditDepartamentoDialogComponent,
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,

    // 06 - LOCALIDADES
    EditAbmLocalidadesDialogComponent,
    AbmLocalidadesComponent,
    AbmLocalidadesDashboardComponent,
    AbmLocalidadesFilterComponent,

    // 08 - CONDICIONES DE IVA
    AddEditCondicionIvaDialogComponent,
    CondicionIvaComponent,
    CondicionIvaDashboardComponent,
    CondicionIvaFilterComponent,
    
    // 09 - ESTADO CIVIL
    AddEditEstadoCivilDialogComponent,
    EstadoCivilComponent,
    EstadoCivilDashboardComponent,
    EstadoCivilFilterComponent,

    // 12 - OBRA SOCIAL
    AddEditObraSocialDialogComponent,
    ObraSocialDashboardComponent,
    ObraSocialFilterComponent,
    ObraSocialComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class ParametrosModule { }
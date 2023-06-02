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

import { EditNacionalidadDialogComponent } from './nacionalidad/components/edit-nacionalidad-dialog/edit-nacionalidad-dialog.component';
import { NacionalidadComponent } from './nacionalidad/nacionalidad.component';
import { NacionalidadDashboardComponent } from './nacionalidad/components/nacionalidad-dashboard/nacionalidad-dashboard.component';
import { NacionalidadFilterComponent } from './nacionalidad/components/nacionalidad-filter/nacionalidad-filter.component';
// 04 - DEPARTAMENTO
import { AddEditDepartamentoDialogComponent } from './departamento/components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { DepartamentoDashboardComponent } from './departamento/components/departamento-dashboard/departamento-dashboard.component';
import { DepartamentoFilterComponent } from './departamento/components/departamento-filter/departamento-filter.component';

// 05 - POSICIONES
import { AbmPosicionesComponent } from './abm-posiciones/abm-posiciones.component';
import { AddEditAbmPosicionesComponent } from './abm-posiciones/add-edit-abm-posiciones/add-edit-abm-posiciones.component';
import { AbmPosicionesFilterComponent } from './abm-posiciones/abm-posiciones-filter/abm-posiciones-filter.component';
import { AbmPosicionesDashboardComponent } from './abm-posiciones/abm-posiciones-dashboard/abm-posiciones-dashboard.component';

// 06 - LOCALIDADES
import { EditAbmLocalidadesDialogComponent } from './abm-localidades/components/abm-localidades-dialog/edit-abm-localidades-dialog.component';
import { AbmLocalidadesComponent } from './abm-localidades/abm-localidades.component';
import { AbmLocalidadesDashboardComponent } from './abm-localidades/components/abm-localidades-dashboard/abm-localidades-dashboard.component';
import { AbmLocalidadesFilterComponent } from './abm-localidades/components/abm-localidades-filter/abm-localidades-filter.component';

// 07 - FORMAS DE PAGO
import { AddEditFormasPagoDialogComponent } from "./formas-pago/components/add-edit-formas-pago-dialog/add-edit-formas-pago-dialog.component";
import { FormasPagoComponent } from "./formas-pago/formas-pago.component";
import { FormasPagoDashboardComponent } from "./formas-pago/components/formas-pago-dashboard/formas-pago-dashboard.component";
import { FormasPagoFilterComponent } from "./formas-pago/components/formas-pago-filter/formas-pago-filter.component";

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
// 11 - FUENTE INGRESO
import { FuenteIngresoComponent } from './fuente-ingreso/fuente-ingreso.component';
import { AddEditFuenteIngresoDialogComponent } from './fuente-ingreso/components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import { FuenteIngresoFilterComponent } from './fuente-ingreso/components/fuente-ingreso-filter/fuente-ingreso-filter.component';
import { FuenteIngresoDashboardComponent } from './fuente-ingreso/components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';
// 12 - OBRA SOCIAL
import { AddEditObraSocialDialogComponent } from './obra-social/components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';
import { ObraSocialDashboardComponent } from './obra-social/components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocialFilterComponent } from './obra-social/components/obra-social-filter/obra-social-filter.component';
// 13 - PREGUNTAS DDJJ
import { AddEditPreguntasDDJJDialogComponent } from './preguntas-ddjj/components/add-edit-preguntas-ddjj-dialog/add-edit-preguntas-ddjj-dialog.component';
import { PreguntasDDJJComponent } from "./preguntas-ddjj/preguntas-ddjj.component";
import { PreguntasDDJJDashboardComponent } from './preguntas-ddjj/components/preguntas-ddjj-dashboard/preguntas-ddjj-dashboard.component';
import { PreguntasDDJJFilterComponent } from './preguntas-ddjj/components/preguntas-ddjj-filter/preguntas-ddjj-filter.component';
import { ModalLocalidadComponent } from './abm-posiciones/add-edit-abm-posiciones/modal-localidad/modal-localidad.component';

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
    EditNacionalidadDialogComponent,
    NacionalidadComponent,
    NacionalidadDashboardComponent,
    NacionalidadFilterComponent,

    ModalLocalidadComponent,

    
    // 04 - DEPARTAMENTO
    AddEditDepartamentoDialogComponent,
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,

    // 05 - POSICIONES
    AbmPosicionesComponent,
    AddEditAbmPosicionesComponent,
    AbmPosicionesFilterComponent,
    AbmPosicionesDashboardComponent,

    // 06 - LOCALIDADES
    EditAbmLocalidadesDialogComponent,
    AbmLocalidadesComponent,
    AbmLocalidadesDashboardComponent,
    AbmLocalidadesFilterComponent,

    // 07 - FORMAS DE PAGO
    AddEditFormasPagoDialogComponent,
    FormasPagoComponent,
    FormasPagoDashboardComponent,
    FormasPagoFilterComponent,

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

    // 11 - FUENTE INGRESO
    FuenteIngresoComponent,
    AddEditFuenteIngresoDialogComponent,
    FuenteIngresoFilterComponent,
    FuenteIngresoDashboardComponent,

    // 12 - OBRA SOCIAL
    AddEditObraSocialDialogComponent,
    ObraSocialDashboardComponent,
    ObraSocialFilterComponent,
    ObraSocialComponent,

    // 13 - PREGUNTAS DDJJ
    AddEditPreguntasDDJJDialogComponent,
    PreguntasDDJJComponent,
    PreguntasDDJJDashboardComponent,
    PreguntasDDJJFilterComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ]
})
export class ParametrosModule { }
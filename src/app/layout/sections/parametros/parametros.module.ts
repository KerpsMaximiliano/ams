import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// * Modules
import { SharedModule } from '../../../shared/shared.module';
import { ParametrosRoutingModule } from './parametros-routing.module';

// * Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// * Components
// 01 - PROVINCIAS
import { AddEditProvinciaDialogComponent } from './provincia/components/add-edit-provincia-dialog/add-edit-provincia-dialog.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { ProvinciaDashboardComponent } from './provincia/components/provincia-dashboard/provincia-dashboard.component';
import { ProvinciaFilterComponent } from './provincia/components/provincia-filter/provincia-filter.component';
// 02 - TIPOS DE DOCUMENTO
import { AddEditTipoDocumentoDialogComponent } from './tipo-documento/components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { TipoDocumentoDashboardComponent } from './tipo-documento/components/tipo-documento-dashboard/tipo-documento-dashboard.component';
import { TipoDocumentoFilterComponent } from './tipo-documento/components/tipo-documento-filter/tipo-documento-filter.component';
// 03 - NACIONALIDADES
import { AddEditNacionalidadDialogComponent } from './nacionalidad/components/add-edit-nacionalidad-dialog/add-edit-nacionalidad-dialog.component';
import { NacionalidadComponent } from './nacionalidad/nacionalidad.component';
import { NacionalidadDashboardComponent } from './nacionalidad/components/nacionalidad-dashboard/nacionalidad-dashboard.component';
import { NacionalidadFilterComponent } from './nacionalidad/components/nacionalidad-filter/nacionalidad-filter.component';
// 04 - DEPARTAMENTOS
import { AddEditDepartamentoDialogComponent } from './departamento/components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { DepartamentoDashboardComponent } from './departamento/components/departamento-dashboard/departamento-dashboard.component';
import { DepartamentoFilterComponent } from './departamento/components/departamento-filter/departamento-filter.component';
// 05 - POSICIONES
import { PosicionComponent } from './posicion/posicion.component';
import { AddEditPosicionDialogComponent } from './posicion/add-edit-posicion-dialog/add-edit-posicion-dialog.component';
import { PosicionFilterComponent } from './posicion/posicion-filter/posicion-filter.component';
import { PosicionDashboardComponent } from './posicion/posicion-dashboard/posicion-dashboard.component';
// 06 - LOCALIDADES
import { AddEditLocalidadDialogComponent } from './localidad/components/add-edit-localidad-dialog/add-edit-localidad-dialog.component';
import { LocalidadComponent } from './localidad/localidad.component';
import { LocalidadDashboardComponent } from './localidad/components/localidad-dashboard/localidad-dashboard.component';
import { LocalidadFilterComponent } from './localidad/components/localidad-filter/localidad-filter.component';
// 07 - FORMAS DE PAGO
import { AddEditFormaPagoDialogComponent } from './forma-pago/components/add-edit-forma-pago-dialog/add-edit-forma-pago-dialog.component';
import { FormaPagoComponent } from './forma-pago/forma-pago.component';
import { FormaPagoDashboardComponent } from './forma-pago/components/forma-pago-dashboard/forma-pago-dashboard.component';
import { FormaPagoFilterComponent } from './forma-pago/components/forma-pago-filter/forma-pago-filter.component';
// 08 - CONDICIONES DE IVA
import { AddEditCondicionIvaDialogComponent } from './condicion-iva/components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
import { CondicionIvaDashboardComponent } from './condicion-iva/components/condicion-iva-dashboard/condicion-iva-dashboard.component';
import { CondicionIvaFilterComponent } from './condicion-iva/components/condicion-iva-filter/condicion-iva-filter.component';
// 09 - ESTADOS CIVILES
import { AddEditEstadoCivilDialogComponent } from './estado-civil/components/add-edit-estado-civil-dialog/add-edit-estado-civil-dialog.component';
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
import { EstadoCivilDashboardComponent } from './estado-civil/components/estado-civil-dashboard/estado-civil-dashboard.component';
import { EstadoCivilFilterComponent } from './estado-civil/components/estado-civil-filter/estado-civil-filter.component';
// 10 - MOTIVOS DE MOVIMIENTOS
import { AddEditMotivoMovimientoDialogComponent } from './motivo-movimiento/components/add-edit-motivo-movimiento-dialog/add-edit-motivo-movimiento-dialog.component';
import { MotivoMovimientoComponent } from './motivo-movimiento/motivo-movimiento.component';
import { MotivoMovimientoDashboardComponent } from './motivo-movimiento/components/motivo-movimiento-dashboard/motivo-movimiento-dashboard.component';
import { MotivoMovimientoFilterComponent } from './motivo-movimiento/components/motivo-movimiento-filter/motivo-movimiento-filter.component';
// 11 - FUENTES INGRESO
import { FuenteIngresoComponent } from './fuente-ingreso/fuente-ingreso.component';
import { AddEditFuenteIngresoDialogComponent } from './fuente-ingreso/components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import { FuenteIngresoFilterComponent } from './fuente-ingreso/components/fuente-ingreso-filter/fuente-ingreso-filter.component';
import { FuenteIngresoDashboardComponent } from './fuente-ingreso/components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';
// 12 - OBRAS SOCIALES
import { AddEditObraSocialDialogComponent } from './obra-social/components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';
import { ObraSocialDashboardComponent } from './obra-social/components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocialFilterComponent } from './obra-social/components/obra-social-filter/obra-social-filter.component';
// 13 - PREGUNTAS DE DECLARACIONES JURADAS
import { AddEditPreguntasDDJJDialogComponent } from './preguntas-ddjj/components/add-edit-preguntas-ddjj-dialog/add-edit-preguntas-ddjj-dialog.component';
import { PreguntasDDJJComponent } from './preguntas-ddjj/preguntas-ddjj.component';
import { PreguntasDDJJDashboardComponent } from './preguntas-ddjj/components/preguntas-ddjj-dashboard/preguntas-ddjj-dashboard.component';
import { PreguntasDDJJFilterComponent } from './preguntas-ddjj/components/preguntas-ddjj-filter/preguntas-ddjj-filter.component';

import { ModalLocalidadComponent } from './posicion/add-edit-posicion-dialog/modal-localidad/modal-localidad.component';

@NgModule({
  declarations: [
    // 01 - PROVINCIAS
    AddEditProvinciaDialogComponent,
    ProvinciaComponent,
    ProvinciaDashboardComponent,
    ProvinciaFilterComponent,
    // 02 - TIPOS DE DOCUMENTO
    AddEditTipoDocumentoDialogComponent,
    TipoDocumentoComponent,
    TipoDocumentoDashboardComponent,
    TipoDocumentoFilterComponent,
    // 03 - NACIONALIDADES
    AddEditNacionalidadDialogComponent,
    NacionalidadComponent,
    NacionalidadDashboardComponent,
    NacionalidadFilterComponent,
    // 04 - DEPARTAMENTOS
    AddEditDepartamentoDialogComponent,
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,
    // 05 - POSICIONES
    AddEditPosicionDialogComponent,
    PosicionComponent,
    PosicionFilterComponent,
    PosicionDashboardComponent,
    // 06 - LOCALIDADES
    AddEditLocalidadDialogComponent,
    LocalidadComponent,
    LocalidadDashboardComponent,
    LocalidadFilterComponent,
    // 07 - FORMAS DE PAGO
    AddEditFormaPagoDialogComponent,
    FormaPagoComponent,
    FormaPagoDashboardComponent,
    FormaPagoFilterComponent,
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
    // 10 - MOTIVOS DE MOVIMIENTOS
    AddEditMotivoMovimientoDialogComponent,
    MotivoMovimientoComponent,
    MotivoMovimientoDashboardComponent,
    MotivoMovimientoFilterComponent,
    // 11 - FUENTES INGRESO
    FuenteIngresoComponent,
    AddEditFuenteIngresoDialogComponent,
    FuenteIngresoFilterComponent,
    FuenteIngresoDashboardComponent,
    // 12 - OBRAS SOCIALES
    AddEditObraSocialDialogComponent,
    ObraSocialDashboardComponent,
    ObraSocialFilterComponent,
    ObraSocialComponent,
    // 13 - PREGUNTAS DE DECLARACIONES JURADAS
    AddEditPreguntasDDJJDialogComponent,
    PreguntasDDJJComponent,
    PreguntasDDJJDashboardComponent,
    PreguntasDDJJFilterComponent,

    ModalLocalidadComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule,
    MatAutocompleteModule,
  ],
})
export class ParametrosModule {}

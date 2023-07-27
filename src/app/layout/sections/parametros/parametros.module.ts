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
import { PosicionSetDialogComponent } from './posicion/add-edit-posicion-dialog/posicion-set-dialog/posicion-set-dialog.component';
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
import { AddEditFuenteIngresoDialogComponent } from './fuente-ingreso/components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import { FuenteIngresoComponent } from './fuente-ingreso/fuente-ingreso.component';
import { FuenteIngresoFilterComponent } from './fuente-ingreso/components/fuente-ingreso-filter/fuente-ingreso-filter.component';
import { FuenteIngresoDashboardComponent } from './fuente-ingreso/components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';
import { ModalFuenteIngresoComponent } from './fuente-ingreso/components/add-edit-fuente-ingreso-dialog/modal-fuente-ingreso/modal-fuente-ingreso.component';
// 12 - OBRAS SOCIALES
import { AddEditObraSocialDialogComponent } from './obra-social/components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialComponent } from './obra-social/obra-social.component';
import { ObraSocialDashboardComponent } from './obra-social/components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocialFilterComponent } from './obra-social/components/obra-social-filter/obra-social-filter.component';
// 13 - PREGUNTAS DE DECLARACIONES JURADAS
import { AddEditPreguntaDDJJDialogComponent } from './pregunta-ddjj/components/add-edit-pregunta-ddjj-dialog/add-edit-pregunta-ddjj-dialog.component';
import { PreguntaDDJJComponent } from './pregunta-ddjj/pregunta-ddjj.component';
import { PreguntaDDJJDashboardComponent } from './pregunta-ddjj/components/pregunta-ddjj-dashboard/pregunta-ddjj-dashboard.component';
import { PreguntaDDJJFilterComponent } from './pregunta-ddjj/components/pregunta-ddjj-filter/pregunta-ddjj-filter.component';
// 20 - PRODUCTOS
import { AddEditProductoDialogComponent } from './producto/components/add-edit-producto-dialog/add-edit-producto-dialog.component';
import { SetProductoPrimarioDialogComponent } from './producto/components/add-edit-producto-dialog/set-producto-primario-dialog/set-producto-primario-dialog.component';
import { SetFuenteIngresoDialogComponent } from './producto/components/add-edit-producto-dialog/set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';
import { SetObraSocialDialogComponent } from './producto/components/add-edit-producto-dialog/set-obra-social-dialog/set-obra-social-dialog.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductoDashboardComponent } from './producto/components/producto-dashboard/producto-dashboard.component';
import { ProductoFilterComponent } from './producto/components/producto-filter/producto-filter.component';
// 21 - PARENTESCO POR PRODUCTOS
import { AddEditParentescoProductoDialogComponent } from './parentesco-producto/components/add-edit-parentesco-producto-dialog/add-edit-parentesco-producto-dialog.component';
import { ParentescoProductoComponent } from './parentesco-producto/parentesco-producto.component';
import { ParentescoProductoFilterComponent } from './parentesco-producto/components/parentesco-producto-filter/parentesco-producto-filter.component';
import { ParentescoProductoDashboardComponent } from './parentesco-producto/components/parentesco-producto-dashboard/parentesco-producto-dashboard.component';
// 22 - MOTIVO DE MOVIMIENTO POR PRODUCTO
import { AddEditMotivoMovimientoProductoDialogComponent } from './motivo-movimiento-producto/components/add-edit-motivo-movimiento-producto-dialog/add-edit-motivo-movimiento-producto-dialog.component';
import { MotivoMovimientoProductoComponent } from './motivo-movimiento-producto/motivo-movimiento-producto.component';
import { MotivoMovimientoProductoDashboardComponent } from './motivo-movimiento-producto/components/motivo-movimiento-producto-dashboard/motivo-movimiento-producto-dashboard.component';
import { MotivoMovimientoProductoFilterComponent } from './motivo-movimiento-producto/components/motivo-movimiento-producto-filter/motivo-movimiento-producto-filter.component';
import { SetMotivoDialogComponent } from './motivo-movimiento-producto/components/add-edit-motivo-movimiento-producto-dialog/set-motivo-dialog/set-motivo-dialog.component';
// 23 - SUB MOTIVO DE MOVIMIENTO POR PRODUCTO
import { AddEditSubMotivoMovimientoProductoDialogComponent } from './sub-motivo-movimiento-producto/components/add-edit-sub-motivo-movimiento-producto-dialog/add-edit-sub-motivo-movimiento-producto-dialog.component';
import { SubMotivoMovimientoProductoDashboardComponent } from './sub-motivo-movimiento-producto/components/sub-motivo-movimiento-producto-dashboard/sub-motivo-movimiento-producto-dashboard.component';
import { SubmotivoMovimientoProductoFilterComponent } from './sub-motivo-movimiento-producto/components/sub-motivo-movimiento-producto-filter/sub-motivo-movimiento-producto-filter.component';
import { SubMotivoMovimientoProductoComponent } from './sub-motivo-movimiento-producto/sub-motivo-movimiento-producto.component';
// 24 - UNIFICACION DE APORTES
import { UnificacionAporteProductoComponent } from './unificacion-aporte-producto/unificacion-aporte-producto.component';
import { UnificacionAporteProductoDashboardComponent } from './unificacion-aporte-producto/components/unificacion-aporte-producto-dashboard/unificacion-aporte-producto-dashboard.component';
import { UnificacionAporteProductoFilterComponent } from './unificacion-aporte-producto/components/unificacion-aporte-producto-filter/unificacion-aporte-producto-filter.component';
import { AddEditUnificacionAporteProductoComponent } from './unificacion-aporte-producto/components/add-edit-unificacion-aporte-producto/add-edit-unificacion-aporte-producto.component';
import { UnificacionSetProductoDialogComponent } from './unificacion-aporte-producto/components/add-edit-unificacion-aporte-producto/unificacion-set-producto-dialog/unificacion-set-producto-dialog.component';
// 30 - REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMATICAS
import { AddEditMvmtsNovedadesAutoDialogComponent } from './mvmts-novedades-auto/components/add-edit-mvmts-novedades-auto-dialog/add-edit-mvmts-novedades-auto-dialog.component';
import { MvmtsNovedadesAutoComponent } from './mvmts-novedades-auto/mvmts-novedades-auto.component';
import { MvmtsNovedadesAutoDashboardComponent } from './mvmts-novedades-auto/components/mvmts-novedades-auto-dashboard/mvmts-novedades-auto-dashboard.component';
import { MvmtsNovedadesAutoFilterComponent } from './mvmts-novedades-auto/components/mvmts-novedades-auto-filter/mvmts-novedades-auto-filter.component';
import { SetProdSubDialogComponent } from './mvmts-novedades-auto/components/set-producto-dialog/set-producto-dialog.component';
import { SetPlanDialogComponent } from './mvmts-novedades-auto/components/add-edit-mvmts-novedades-auto-dialog/set-plan-dialog/set-plan-dialog.component';
import { FuenteIngresoSetDialogComponent } from './mvmts-novedades-auto/components/set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';
import { SetMotivoMovimientoDialogComponent } from './mvmts-novedades-auto/components/add-edit-mvmts-novedades-auto-dialog/set-motivo-movimiento-dialog/set-motivo-movimiento-dialog.component';
// 31 - ATRIBUTOS DE RELACIÓN CAPITA/PLAN
import { AddEditAtributosRelacionCapitaPlanDialogComponent } from './atributos-relacion-capita-plan/components/add-edit-atributos-relacion-capita-plan-dialog/add-edit-atributos-relacion-capita-plan-dialog.component';
import { AtributosRelacionCapitaPlanComponent } from './atributos-relacion-capita-plan/atributos-relacion-capita-plan.component';
import { AtributosRelacionCapitaPlanDashboardComponent } from './atributos-relacion-capita-plan/components/atributos-relacion-capita-plan-dashboard/atributos-relacion-capita-plan-dashboard.component';
import { AtributosRelacionCapitaPlanFilterComponent } from './atributos-relacion-capita-plan/components/atributos-relacion-capita-plan-filter/atributos-relacion-capita-plan-filter.component';
import { AtributosRelacionCapitaPlanSetPlanDialogComponent } from './atributos-relacion-capita-plan/components/atributos-relacion-capita-plan-set-plan-dialog/atributos-relacion-capita-plan-set-plan-dialog.component';
import { AtributosRelacionCapitaPlanSetProductoDialogComponent } from './atributos-relacion-capita-plan/components/atributos-relacion-capita-plan-set-producto-dialog/atributos-relacion-capita-plan-set-producto-dialog.component';
// 32 - EXTENCION DE FUENTES DE INGRESOS
import { ExtencionFuenteIngresoComponent } from './extencion-fuente-ingreso/extencion-fuente-ingreso.component';
import { ExtencionFuenteIngresoDashboardComponent } from './extencion-fuente-ingreso/components/extencion-fuente-ingreso-dashboard/extencion-fuente-ingreso-dashboard.component';
import { ExtencionFuenteIngresoFilterComponent } from './extencion-fuente-ingreso/components/extencion-fuente-ingreso-filter/extencion-fuente-ingreso-filter.component';
import { AddEditExtencionFuenteIngresoComponent } from './extencion-fuente-ingreso/components/add-edit-extencion-fuente-ingreso/add-edit-extencion-fuente-ingreso.component';
import { ModalExtencionProductoComponent } from './extencion-fuente-ingreso/components/add-edit-extencion-fuente-ingreso/modal-extencion-producto/modal-extencion-producto.component';
import { LocalidadSetDialogComponent } from './localidad/components/add-edit-localidad-dialog/localidad-set-posicion-dialog/localidad-set-posicion-dialog.component';
// 33 - TAMBOS
import { AddEditTamboDialogComponent } from './tambo/components/add-edit-tambo-dialog/add-edit-tambo-dialog.component';
import { TamboComponent } from './tambo/tambo.component';
import { TamboDashboardComponent } from './tambo/components/tambo-dashboard/tambo-dashboard.component';
import { TamboFilterComponent } from './tambo/components/tambo-filter/tambo-filter.component';
import { TamboSetEntidadDialogComponent } from './tambo/components/tambo-set-posicion-dialog/tambo-set-entidad-dialog.component';
// 34 - EMPRESA QUE FACTURA
import { AddEditEmpresaFacturaComponent } from './empresa-factura/components/add-edit-empresa-factura/add-edit-empresa-factura.component';
import { EmpresaFacturaComponent } from './empresa-factura/empresa-factura.component';
import { EmpresaFacturaDashboardComponent } from './empresa-factura/components/empresa-factura-dashboard/empresa-factura-dashboard.component';
import { EmpresaFacturaFilterComponent } from './empresa-factura/components/empresa-factura-filter/empresa-factura-filter.component';
import { ModalLocalidadComponent } from './empresa-factura/components/add-edit-empresa-factura/modal-localidad/modal-localidad.component';
// 34 B - PAGO LINK
import { AddEditPagoLinkDialogComponent } from './pago-link/components/add-edit-pago-link-dialog/add-edit-pago-link-dialog.component';
import { PagoLinkComponent } from './pago-link/pago-link.component';
import { PagoLinkDashboardComponent } from './pago-link/components/pago-link-dashboard/pago-link-dashboard.component';
import { PagoLinkFilterComponent } from './pago-link/components/pago-link-filter/pago-link-filter.component';
// 35 - MONTOS MINIMO
import { AddEditMontoMinimoComponent } from './montos-minimo/components/add-edit-montos-minimo/add-edit-monto-minimo.component';
import { MontoMinimoComponent } from './montos-minimo/monto-minimo.component';
import { MontoMinimoDashboardComponent } from './montos-minimo/components/monto-minimo-dashboard/monto-minimo-dashboard.component';
import { MontoMinimoFilterComponent } from './montos-minimo/components/monto-minimo-filter/monto-minimo-filter.component';

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
    // 04 - DEPARTAMENTO
    AddEditDepartamentoDialogComponent,
    DepartamentoComponent,
    DepartamentoDashboardComponent,
    DepartamentoFilterComponent,
    // 05 - POSICIONES
    AddEditPosicionDialogComponent,
    PosicionComponent,
    PosicionFilterComponent,
    PosicionDashboardComponent,
    PosicionSetDialogComponent,
    // 06 - LOCALIDADES
    AddEditLocalidadDialogComponent,
    LocalidadComponent,
    LocalidadDashboardComponent,
    LocalidadFilterComponent,
    LocalidadSetDialogComponent,
    // 07 - FORMAS DE PAGO
    AddEditFormaPagoDialogComponent,
    FormaPagoComponent,
    FormaPagoDashboardComponent,
    FormaPagoFilterComponent,
    ModalFuenteIngresoComponent,
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
    AddEditPreguntaDDJJDialogComponent,
    PreguntaDDJJComponent,
    PreguntaDDJJDashboardComponent,
    PreguntaDDJJFilterComponent,
    // 20 - PRODUCTO
    AddEditProductoDialogComponent,
    SetProductoPrimarioDialogComponent,
    SetFuenteIngresoDialogComponent,
    SetObraSocialDialogComponent,
    ProductoComponent,
    ProductoDashboardComponent,
    ProductoFilterComponent,
    // 21 - PARENTESCO POR PRODUCTO
    ParentescoProductoComponent,
    ParentescoProductoFilterComponent,
    ParentescoProductoDashboardComponent,
    AddEditParentescoProductoDialogComponent,
    // 22 - MOTIVO DE MOVIMIENTO POR PRODUCTO
    AddEditMotivoMovimientoProductoDialogComponent,
    MotivoMovimientoProductoDashboardComponent,
    MotivoMovimientoProductoFilterComponent,
    MotivoMovimientoProductoComponent,
    SetMotivoDialogComponent,
    // 23 - SUB MOTIVO DE MOVIMIENTO POR PRODUCTO
    SubMotivoMovimientoProductoComponent,
    SubmotivoMovimientoProductoFilterComponent,
    SubMotivoMovimientoProductoDashboardComponent,
    AddEditSubMotivoMovimientoProductoDialogComponent,
    // 24 - UNIFICACION DE APORTES
    AddEditUnificacionAporteProductoComponent,
    UnificacionAporteProductoComponent,
    UnificacionAporteProductoDashboardComponent,
    UnificacionAporteProductoFilterComponent,
    UnificacionSetProductoDialogComponent,
    // 30 - REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMATICAS
    AddEditMvmtsNovedadesAutoDialogComponent,
    MvmtsNovedadesAutoDashboardComponent,
    MvmtsNovedadesAutoFilterComponent,
    MvmtsNovedadesAutoComponent,
    SetProdSubDialogComponent,
    SetPlanDialogComponent,
    FuenteIngresoSetDialogComponent,
    SetMotivoMovimientoDialogComponent,
    // 31 - ATRIBUTOS DE RELACIÓN CAPITA/PLAN
    AddEditAtributosRelacionCapitaPlanDialogComponent,
    AtributosRelacionCapitaPlanComponent,
    AtributosRelacionCapitaPlanDashboardComponent,
    AtributosRelacionCapitaPlanFilterComponent,
    AtributosRelacionCapitaPlanSetPlanDialogComponent,
    AtributosRelacionCapitaPlanSetProductoDialogComponent,
    // 32 - EXTENCION FUENTES DE INGRESOS
    ExtencionFuenteIngresoComponent,
    ExtencionFuenteIngresoDashboardComponent,
    ExtencionFuenteIngresoFilterComponent,
    AddEditExtencionFuenteIngresoComponent,
    ModalExtencionProductoComponent,
    // 33 - TAMBOS
    AddEditTamboDialogComponent,
    TamboComponent,
    TamboDashboardComponent,
    TamboFilterComponent,
    TamboSetEntidadDialogComponent,
    // 34 - EMPRESA QUE FACTURA
    AddEditEmpresaFacturaComponent,
    EmpresaFacturaComponent,
    EmpresaFacturaDashboardComponent,
    EmpresaFacturaFilterComponent,
    ModalLocalidadComponent,
    // 34 B - PAGO LINK
    AddEditPagoLinkDialogComponent,
    PagoLinkComponent,
    PagoLinkDashboardComponent,
    PagoLinkFilterComponent,
    // 35 - MONTOS MINIMO
    AddEditMontoMinimoComponent,
    MontoMinimoComponent,
    MontoMinimoDashboardComponent,
    MontoMinimoFilterComponent,
  ],
  imports: [
    CommonModule,
    ParametrosRoutingModule,
    SharedModule,
    MatAutocompleteModule,
  ],
})
export class ParametrosModule {}

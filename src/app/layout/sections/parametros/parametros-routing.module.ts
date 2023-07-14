import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// * Components
// 01 - PROVINCIAS
import { ProvinciaComponent } from './provincia/provincia.component';
// 02 - TIPOS DE DOCUMENTO
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
// 03 - NACIONALIDADES
import { NacionalidadComponent } from './nacionalidad/nacionalidad.component';
// 04 - DEPARTAMENTOS
import { DepartamentoComponent } from './departamento/departamento.component';
// 05 - POSICIONES
import { PosicionComponent } from './posicion/posicion.component';
// 06 - LOCALIDADES
import { LocalidadComponent } from './localidad/localidad.component';
// 07 - FORMAS DE PAGO
import { FormaPagoComponent } from './forma-pago/forma-pago.component';
// 08 - CONDICIONES DE IVA
import { CondicionIvaComponent } from './condicion-iva/condicion-iva.component';
// 09 - ESTADOS CIVILES
import { EstadoCivilComponent } from './estado-civil/estado-civil.component';
// 10 - MOTIVOS DE MOVIMIENTO
import { MotivoMovimientoComponent } from './motivo-movimiento/motivo-movimiento.component';
// 11 - FUENTES INGRESO
import { FuenteIngresoComponent } from './fuente-ingreso/fuente-ingreso.component';
// 12 - OBRAS SOCIALES
import { ObraSocialComponent } from './obra-social/obra-social.component';
// 13 - PREGUNTAS DE DECLARACIONES JURADS
import { PreguntaDDJJComponent } from './pregunta-ddjj/pregunta-ddjj.component';
// 20 - PRODUCTO
import { ProductoComponent } from './producto/producto.component';
// 21 - PARENTESCOS
import { ParentescoProductoComponent } from './parentesco-producto/parentesco-producto.component';
// 22 - MOTIVO DE MOVIMIENTO POR PRODUCTO
import { MotivoMovimientoProductoComponent } from './motivo-movimiento-producto/motivo-movimiento-producto.component';
// 23 - SUB MOTIVO DE MOVIMIENTO POR PRODUCTO
import { SubMotivoMovimientoProductoComponent } from './sub-motivo-movimiento-producto/sub-motivo-movimiento-producto.component';
// 24 - UNIFICACION DE APORTES
import { UnificacionAporteProductoComponent } from './unificacion-aporte-producto/unificacion-aporte-producto.component';
// 30 - REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMATICAS
import { MvmtsNovedadesAutoComponent } from './mvmts-novedades-auto/mvmts-novedades-auto.component';
// 32 - EXTENCION FUENTES DE INGRESOS
import { ExtencionFuenteIngresoComponent } from './extencion-fuente-ingreso/extencion-fuente-ingreso.component';
// 34 - EMPRESA FACTURA
import { EmpresaFacturaComponent } from './empresa-factura/empresa-factura.component';

const routes: Routes = [
  {
    path: 'parametros/provincias',
    component: ProvinciaComponent,
  },
  {
    path: 'parametros/tipos-documento',
    component: TipoDocumentoComponent,
  },
  {
    path: 'parametros/nacionalidades',
    component: NacionalidadComponent,
  },
  {
    path: 'parametros/departamentos',
    component: DepartamentoComponent,
  },
  {
    path: 'parametros/posiciones',
    component: PosicionComponent,
  },
  {
    path: 'parametros/localidades',
    component: LocalidadComponent,
  },
  {
    path: 'parametros/formas-pago',
    component: FormaPagoComponent,
  },
  {
    path: 'parametros/condiciones-iva',
    component: CondicionIvaComponent,
  },
  {
    path: 'parametros/estados-civiles',
    component: EstadoCivilComponent,
  },
  {
    path: 'parametros/motivos-movimientos',
    component: MotivoMovimientoComponent,
  },
  {
    path: 'parametros/fuentes-ingreso',
    component: FuenteIngresoComponent,
  },
  {
    path: 'parametros/obras-sociales',
    component: ObraSocialComponent,
  },
  {
    path: 'parametros/preguntas-ddjj',
    component: PreguntaDDJJComponent,
  },
  {
    path: 'parametros/productos',
    component: ProductoComponent,
  },
  {
    path: 'parametros/parentesco-producto',
    component: ParentescoProductoComponent,
  },
  {
    path: 'parametros/motivo-movimiento-producto',
    component: MotivoMovimientoProductoComponent,
  },
  {
    path: 'parametros/sub-motivo-movimiento-producto',
    component: SubMotivoMovimientoProductoComponent,
  },
  {
    path: 'parametros/unificacion-aportes-producto',
    component: UnificacionAporteProductoComponent,
  },
  {
    path: 'parametros/mvmts-novedades-automaticas',
    component: MvmtsNovedadesAutoComponent,
  },
  {
    path: 'parametros/extencion-fuente-ingreso',
    component: ExtencionFuenteIngresoComponent,
  },
  {
    path: 'parametros/empresa-factura',
    component: EmpresaFacturaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrosRoutingModule {}

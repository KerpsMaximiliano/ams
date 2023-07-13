import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditFuenteIngresoDialogComponent } from '../add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';

export interface searchValue {
  par_modo: string;
  empresa_asociada: Number;
  descripcion: string;
}

@Component({
  selector: 'app-fuente-ingreso-dashboard',
  templateUrl: './fuente-ingreso-dashboard.component.html',
  styleUrls: ['./fuente-ingreso-dashboard.component.scss'],
})
export class FuenteIngresoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() public datosEmpresas: IEmpresaFactura[];

  public displayedColumns: string[] = [
    'codigo_fuente_ingreso',
    'descripcion',
    'empresa_asociada',
    'dia_corte',
    'actions',
  ];

  public dataSource: MatTableDataSource<IFuenteIngreso>;
  fuenteIngresos: IFuenteIngreso[];

  constructor(
    private utilService: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private matPaginatorIntl: MatPaginatorIntl,
    private fuentesIngresoService: FuenteIngresoService
  ) {}

  ngOnInit() {
    this.paginator._intl = this.matPaginatorIntl;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Última página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? `Página ${page + 1} de ${Math.ceil(length / pageSize)}`
        : 'Página 0 de 0';
    };
  }

  public obtenerNombreEmpresa(id: number): string {
    const empresa = this.datosEmpresas.find((emp) => emp.id_empresa === id);
    return empresa ? empresa.descripcion : '';
  }

  public getFuenteIngreso(body: any): void {
    this.utilService.openLoading();
    this.fuentesIngresoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.fuenteIngresos = res.dataset as IFuenteIngreso[])
          : (this.fuenteIngresos = [res.dataset]);
        this.dataSource = new MatTableDataSource<IFuenteIngreso>(
          this.fuenteIngresos
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión.', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
        this.dataSource = new MatTableDataSource();
      },
      complete: () => {
        this.utilService.closeLoading();
      },
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editFuenteIngreso(fuenteIngreso: IFuenteIngreso): void {
    const modalNuevoFuenteIngreso = this.dialog.open(
      AddEditFuenteIngresoDialogComponent,
      {
        data: {
          title: `EDITAR FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'U',
          codigo_fuente_ingreso: fuenteIngreso?.codigo_fuente_ingreso,
          tipo_fuente: fuenteIngreso?.tipo_fuente,
          codigo_fuente_admin: fuenteIngreso?.codigo_fuente_admin,
          descripcion: fuenteIngreso?.descripcion,
          descripcion_reducida: fuenteIngreso?.descripcion_reducida,
          solicita_ref: fuenteIngreso?.solicita_ref,
          dia_corte: fuenteIngreso?.dia_corte,
          empresa_asociada: fuenteIngreso?.empresa_asociada,
          nro_solicitud: fuenteIngreso?.nro_solicitud,
          fecha_ultima_liquidacion: fuenteIngreso?.fecha_ultima_liquidacion,
          aporte_adicional: fuenteIngreso?.aporte_adicional,
          fuente_aporte_adicional: fuenteIngreso?.fuente_aporte_adicional,
          concepto_aporte_adicional: fuenteIngreso?.concepto_aporte_adicional,
          controla_dec_jur: fuenteIngreso?.controla_dec_jur,
          comprobante_general: fuenteIngreso?.comprobante_general,
          condicion_venta: fuenteIngreso?.condicion_venta,
          sub_prog_calc: fuenteIngreso?.sub_prog_calc,
          ref_contable_asociada: fuenteIngreso?.ref_contable_asociada,
          concepto_aporte: fuenteIngreso?.concepto_aporte,
          concepto_arancel: fuenteIngreso?.concepto_arancel,
          agrupa_entidades: fuenteIngreso?.agrupa_entidades,
          grupo_familiar_imprimir: fuenteIngreso?.grupo_familiar_imprimir,
          numeracion_auto: fuenteIngreso?.numeracion_auto,
          talonario: fuenteIngreso?.talonario,
          liquida_punitorio: fuenteIngreso?.liquida_punitorio,
          liquida_reintegro: fuenteIngreso?.liquida_reintegro,
          liquida_planes_mix: fuenteIngreso?.liquida_planes_mix,
          liquida_planes_monotributo: fuenteIngreso?.liquida_planes_monotributo,
          selecciona_productos_liq: fuenteIngreso?.selecciona_productos_liq,
          condicion_aporte_adic_dec: fuenteIngreso?.condicion_aporte_adic_dec,
          agrupador_capita: fuenteIngreso?.agrupador_capita,
          liquidacion_mensual: fuenteIngreso?.liquidacion_mensual,
          condicion_venta_venc: fuenteIngreso?.condicion_venta_venc,
          condicion_venta_dos_venc: fuenteIngreso?.condicion_venta_dos_venc,
          datosEmpresa: this.datosEmpresas,
        },
      }
    );

    modalNuevoFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utilService.openLoading();
          this.fuentesIngresoService.CRUD(res).subscribe({
            next: () => {
              this.utilService.notification(
                'La fuente de ingreso se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utilService.closeLoading();
              err.status == 0
                ? this.utilService.notification('Error de conexión. ', 'error')
                : this.utilService.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.editFuenteIngreso(res);
            },
            complete: () => {
              this.utilService.closeLoading();
              setTimeout(() => {}, 300);
              let body = {
                par_modo: 'R',
                codigo_fuente_ingreso: res.codigo_fuente_ingreso,
              };
              this.getFuenteIngreso(body);
            },
          });
        }
      },
    });
  }

  public viewFuenteIngreso(fuenteIngreso: IFuenteIngreso): void {
    this.dialog.open(AddEditFuenteIngresoDialogComponent, {
      data: {
        title: `VER FUENTE DE INGRESO`,
        edit: false,
        par_modo: 'C',
        codigo_fuente_ingreso: fuenteIngreso?.codigo_fuente_ingreso,
        tipo_fuente: fuenteIngreso?.tipo_fuente,
        descripcion: fuenteIngreso?.descripcion,
        descripcion_reducida: fuenteIngreso?.descripcion_reducida,
        solicita_ref: fuenteIngreso?.solicita_ref,
        dia_corte: fuenteIngreso?.dia_corte,
        empresa_asociada: fuenteIngreso?.empresa_asociada,
        nro_solicitud: fuenteIngreso?.nro_solicitud,
        fecha_ultima_liquidacion: fuenteIngreso?.fecha_ultima_liquidacion,
        aporte_adicional: fuenteIngreso?.aporte_adicional,
        fuente_aporte_adicional: fuenteIngreso?.fuente_aporte_adicional,
        concepto_aporte_adicional: fuenteIngreso?.concepto_aporte_adicional,
        controla_dec_jur: fuenteIngreso?.controla_dec_jur,
        comprobante_general: fuenteIngreso?.comprobante_general,
        condicion_venta: fuenteIngreso?.condicion_venta,
        sub_prog_calc: fuenteIngreso?.sub_prog_calc,
        ref_contable_asociada: fuenteIngreso?.ref_contable_asociada,
        concepto_aporte: fuenteIngreso?.concepto_aporte,
        concepto_arancel: fuenteIngreso?.concepto_arancel,
        agrupa_entidades: fuenteIngreso?.agrupa_entidades,
        grupo_familiar_imprimir: fuenteIngreso?.grupo_familiar_imprimir,
        numeracion_auto: fuenteIngreso?.numeracion_auto,
        talonario: fuenteIngreso?.talonario,
        liquida_punitorio: fuenteIngreso?.liquida_punitorio,
        liquida_reintegro: fuenteIngreso?.liquida_reintegro,
        liquida_planes_mix: fuenteIngreso?.liquida_planes_mix,
        liquida_planes_monotributo: fuenteIngreso?.liquida_planes_monotributo,
        selecciona_productos_liq: fuenteIngreso?.selecciona_productos_liq,
        condicion_aporte_adic_dec: fuenteIngreso?.condicion_aporte_adic_dec,
        agrupador_capita: fuenteIngreso?.agrupador_capita,
        liquidacion_mensual: fuenteIngreso?.liquidacion_mensual,
        condicion_venta_venc: fuenteIngreso?.condicion_venta_venc,
        condicion_venta_dos_venc: fuenteIngreso?.condicion_venta_dos_venc,
        datosEmpresa: this.datosEmpresas,
      },
    });
  }

  public filter(buscar: searchValue): void {
    let body = {
      par_modo: buscar.par_modo,
      descripcion: buscar.descripcion,
      desc_empresa: buscar.empresa_asociada,
    };
    this.getFuenteIngreso(body);
  }
}

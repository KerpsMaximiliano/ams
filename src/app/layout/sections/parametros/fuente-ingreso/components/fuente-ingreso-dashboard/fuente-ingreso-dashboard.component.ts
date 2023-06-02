import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditFuenteIngresoDialogComponent } from '../add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';

export interface searchValue {
  empresa_asociada: Number,
  descripcion: string
}

@Component({
  selector: 'app-fuente-ingreso-dashboard',
  templateUrl: './fuente-ingreso-dashboard.component.html',
  styleUrls: ['./fuente-ingreso-dashboard.component.scss']
})
export class FuenteIngresoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_fuente_ingreso',
    'descripcion',
    'empresa_asociada',
    'dia_corte',
    'actions'
  ];

  public dataSource: MatTableDataSource<FuenteIngreso>;
  public searchValue: searchValue;
  fuenteIngresos : FuenteIngreso[]
  listEmpresas: any[];

  constructor(private fuentesIngresoService: FuenteIngresoService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              ) { }

  ngOnInit() {
    let body =
    {
      par_modo: "E"
    }
    this.fuentesIngresoService.fuenteIngresoCRUD(JSON.stringify(body)).subscribe({
      next:(res:any) => {
          this.listEmpresas =  res.dataset;
      },
      error:(err: any) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
      }
    })
  }

  obtenerNombreEmpresa(id: number): string {
    const empresa = this.listEmpresas.find(emp => emp.id_empresa === id);
    return empresa ? empresa.descripcion : '';
  }

  private getFuenteIngreso(): void {
    this.utils.openLoading();
    let body = {
        par_modo: 'C',
        descripcion: this.searchValue.descripcion,
        desc_empresa: this.searchValue.empresa_asociada,
    };
    this.fuentesIngresoService.fuenteIngresoCRUD(JSON.stringify(body)).subscribe({
      next:(res:any) => {
        (res.dataset.length)
          ? this.fuenteIngresos = res.dataset as FuenteIngreso[]
          : this.fuenteIngresos = [res.dataset];
        this.dataSource = new MatTableDataSource<FuenteIngreso>(this.fuenteIngresos);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " +  (this.paginator.pageIndex + 1) + " de " +  this.paginator.length
          }
        }, 100)
      },
      error:(err: any) => {
        console.log(err);
        this.utils.closeLoading();
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
        
      },
      complete: () => {
        this.utils.closeLoading();
      }
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editFuenteIngreso(fuenteIngreso: FuenteIngreso): void {
    const modalNuevoFuenteIngreso = this.dialog.open(AddEditFuenteIngresoDialogComponent, {
      data: {
        title: `Editar Fuente de Ingreso`,
        par_modo: "U",
        edit: true,
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
      }
    });

    modalNuevoFuenteIngreso.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          console.log(res);
          
          this.utils.openLoading();
          this.fuentesIngresoService.fuenteIngresoCRUD(res).subscribe({
            next: () => {
              this.utils.notification("El FuenteIngreso se ha editado extiosamente", 'success')
            },
            error: (err:any) => {
              console.log(err);
              
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
              this.editFuenteIngreso(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewFuenteIngreso(fuenteIngreso: FuenteIngreso): void {
    this.dialog.open(AddEditFuenteIngresoDialogComponent, {
      data: {
        title: `Ver Fuente de Ingreso`,
        edit: false,
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
        comprobante_general:fuenteIngreso?.comprobante_general,
        condicion_venta: fuenteIngreso?.condicion_venta,
        sub_prog_calc:fuenteIngreso?.sub_prog_calc,
        ref_contable_asociada:fuenteIngreso?.ref_contable_asociada,
        concepto_aporte: fuenteIngreso?.concepto_aporte,
        concepto_arancel: fuenteIngreso?.concepto_arancel,
        agrupa_entidades: fuenteIngreso?.agrupa_entidades,
        grupo_familiar_imprimir:fuenteIngreso?.grupo_familiar_imprimir,
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
      }
    });
  }

  public filter(buscar: searchValue): void {
    this.searchValue = buscar;
    this.getFuenteIngreso()
  }
}
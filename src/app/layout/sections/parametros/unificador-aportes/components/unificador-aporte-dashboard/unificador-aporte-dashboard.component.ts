import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { unificacionAporteService } from 'src/app/core/services/unificacion-aportes.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IUnificacionAporte } from 'src/app/core/models/unificacion-aportes.interface';
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

// * Components
import { AddEditUnificadorAporteComponent } from '../add-edit-unificador-aporte/add-edit-unificador-aporte.component';
@Component({
  selector: 'app-unificador-aporte-dashboard',
  templateUrl: './unificador-aporte-dashboard.component.html',
  styleUrls: ['./unificador-aporte-dashboard.component.scss'],
})
export class UnificadorAporteDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() producto: any;
  private productoSerche: any;

  public displayedColumns: string[] = [
    'Codigo_Producto',
    'Producto',
    'Codigo_Subproducto',
    'Subproducto',
    'actions',
  ];

  public dataSource: MatTableDataSource<IUnificacionAporte>;
  public searchProd_cod: number;
  public searchSubProd_cod: number;
  public unificacionAporte: IUnificacionAporte[] = [];
  productos: IProducto[];

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private _producto: ProductoService,
    private _unificacionAporte: unificacionAporteService
  ) {
    this.productosOptions();
    this.productoSerche = this._unificacionAporte.get();
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Ultima página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? 'Página ' + (page + 1) + ' de ' + Math.ceil(length / pageSize)
        : 'Página 0 de 0';
    };
  }

  // * carga el select con los productos
  private productosOptions(): void {
    let body = {
      par_modo: 'L',
      descripcion: '',
    };
    this._producto.CRUD(JSON.stringify(body)).subscribe({
      next: (respuesta) => {
        this.productos = respuesta.dataset;
      },
    });
  }

  // * carga la tabla
  private getUnificacionAporte(): void {
    this.utils.openLoading();
    let body = {
      par_modo: 'R',
    };
    this._unificacionAporte.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        this.unificacionAporte = res.dataset as IUnificacionAporte[];
        if (this.searchSubProd_cod) {
          this.unificacionAporte = this.unificacionAporte.filter(
            (filtro) =>
              parseInt(filtro.producto_principal) == this.searchProd_cod &&
              parseInt(filtro.subproducto_principal) == this.searchSubProd_cod
          );
        } else {
          this.unificacionAporte = this.unificacionAporte.filter(
            (filtro) =>
              parseInt(filtro.producto_principal) == this.searchProd_cod
          );
        }
        this.dataSource = new MatTableDataSource<IUnificacionAporte>(
          this.unificacionAporte
        );
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return (
              'Página ' +
              (this.paginator.pageIndex + 1) +
              ' de ' +
              (Math.floor(this.paginator.length / this.paginator.pageSize) + 1)
            );
          };
        }, 100);
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión.', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
      },
    });
  }

  // * carga los nombres de los productos
  public getproducto(prod: number): string {
    const producto = this.productos.find(
      (filtro: any) => filtro.codigo_producto === prod
    );
    return producto ? producto.descripcion_producto : '';
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editUnificacionAporte(UnificacionAporte: IUnificacionAporte): void {
    const modalNuevaUnificacionAporte = this.dialog.open(
      AddEditUnificadorAporteComponent,
      {
        data: {
          title: `EDITAR UNIFICACIÓN DE APORTE`,
          par_modo: 'U',
          producto_principal: this.getproducto(
            parseInt(UnificacionAporte?.producto_principal)
          ),
          producto_principal_cod: UnificacionAporte?.producto_principal,
          subproducto_principal: this.getproducto(
            parseInt(UnificacionAporte?.subproducto_principal)
          ),
          subproducto_principal_cod: UnificacionAporte?.subproducto_principal,
          producto_secundario: this.getproducto(
            parseInt(UnificacionAporte?.producto_secundario)
          ),
          producto_secundario_cod: UnificacionAporte?.producto_secundario,
          subproducto_secundario: this.getproducto(
            parseInt(UnificacionAporte?.subproducto_secundario)
          ),
          subproducto_secundario_cod: UnificacionAporte?.subproducto_secundario,
          unifica_aportes: 'S',
          edit: true,
        },
      }
    );

    modalNuevaUnificacionAporte.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this._unificacionAporte.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La unificación se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.editUnificacionAporte(res);
            },
            complete: () => {
              this.utils.closeLoading();
            },
          });
        }
      },
    });
  }

  public viewUnificacionAporte(UnificacionAporte: IUnificacionAporte): void {
    this.dialog.open(AddEditUnificadorAporteComponent, {
      data: {
        title: `VER UNIFICACIÓN DE APORTE`,
        edit: false,
        par_modo: 'R',
        producto_principal: this.getproducto(
          parseInt(UnificacionAporte?.producto_principal)
        ),
        producto_principal_cod: UnificacionAporte?.producto_principal,
        subproducto_principal: this.getproducto(
          parseInt(UnificacionAporte?.subproducto_principal)
        ),
        subproducto_principal_cod: UnificacionAporte?.subproducto_principal,
        producto_secundario: this.getproducto(
          parseInt(UnificacionAporte?.producto_secundario)
        ),
        producto_secundario_cod: UnificacionAporte?.producto_secundario,
        subproducto_secundario: this.getproducto(
          parseInt(UnificacionAporte?.subproducto_secundario)
        ),
        subproducto_secundario_cod: UnificacionAporte?.subproducto_secundario,
        unifica_aportes: 'S',
      },
    });
  }

  public deletedUnificacionAporte(UnificacionAporte: IUnificacionAporte): void {
    let body = {
      par_modo: 'D',
      producto_principal_cod: UnificacionAporte?.producto_principal,
      subproducto_principal_cod: UnificacionAporte?.subproducto_principal,
      producto_secundario_cod: UnificacionAporte?.producto_secundario,
      subproducto_secundario_cod: UnificacionAporte?.subproducto_secundario,
      unifica_aportes: UnificacionAporte?.unifica_aportes,
    };
    this.utils.openLoading();
    this._unificacionAporte.CRUD(body).subscribe({
      next: (res) => {
        this.utils.notification(
          'La unificación se ha eliminado extiosamente. ',
          'success'
        );
      },
      error: (err) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
      },
    });
  }

  public filter(): void {
    this.searchProd_cod = this.productoSerche.codigo_producto;
    this.searchSubProd_cod = this.productoSerche.codigo_producto_sub;
    this.getUnificacionAporte();
  }
}

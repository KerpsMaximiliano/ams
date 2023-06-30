import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { SubmotivoMovimientoService } from 'src/app/core/services/submotivo-movimiento.service';

// * Interfaces
import { ISubmotivoMovimiento } from 'src/app/core/models/submotivo-movimiento';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { AddEditSubmotivoMovimientoComponent } from '../add-edit-submotivo-movimiento/add-edit-submotivo-movimiento.component';

@Component({
  selector: 'app-submotivo-movimiento-dashboard',
  templateUrl: './submotivo-movimiento-dashboard.component.html',
  styleUrls: ['./submotivo-movimiento-dashboard.component.scss'],
})
export class SubmotivoMovimientoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_submotivo',
    'descripcion',
    'actions',
  ];

  public dataSource: MatTableDataSource<ISubmotivoMovimiento>;
  public searchProd: number;
  public searchMov: string;
  public searchCod_Mot: number;
  public searchDescripcion: string;
  public SubmotivoMovimiento: ISubmotivoMovimiento[] = [];
  descripcion_producto: string;
  private fecha_hoy: Date = new Date();

  constructor(
    private SubmotivoMovimientoService: SubmotivoMovimientoService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

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

  // * carga submotivos a la tabla
  private getSubmotivoMovimiento(): void {
    this.utils.openLoading();
    let body = JSON.stringify({
      par_modo: 'O',
      movimiento: this.searchMov,
      codigo_motivo: this.searchCod_Mot,
      producto: this.searchProd,
      descripcion: this.searchDescripcion,
    });
    this.SubmotivoMovimientoService.CRUD(body).subscribe({
      next: (res: any) => {
        this.SubmotivoMovimiento = res.dataset as ISubmotivoMovimiento[];
        this.dataSource = new MatTableDataSource<ISubmotivoMovimiento>(
          this.SubmotivoMovimiento
        );
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return (
              'Página ' +
              (this.paginator.pageIndex + 1) +
              ' de ' +
              this.paginator.length
            );
          };
        }, 100);
      },
      error: (err: any) => {
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

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editSubmotivoMovimiento(
    submotivoMovimiento: ISubmotivoMovimiento
  ): void {
    const modalNuevoSubmotivoMovimiento = this.dialog.open(
      AddEditSubmotivoMovimientoComponent,
      {
        data: {
          title: `EDITAR SUBMOTIVO DE MOVIMIENTO`,
          edit: true,
          par_modo: 'U',
          movimiento: submotivoMovimiento?.movimiento,
          codigo_motivo: submotivoMovimiento?.codigo_motivo,
          producto: this.descripcion_producto,
          codigo_producto: submotivoMovimiento?.producto,
          codigo_submotivo: submotivoMovimiento?.codigo_submotivo,
          descripcion: submotivoMovimiento?.descripcion,
          fecha_vigencia: submotivoMovimiento?.fecha_vigencia,
        },
      }
    );

    modalNuevoSubmotivoMovimiento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.SubmotivoMovimientoService.CRUD(res).subscribe({
            next: () => {
              this.utils.closeLoading();
              this.utils.notification(
                'El submotivo se ha editado extiosamente. ',
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
              this.editSubmotivoMovimiento(res);
            },
          });
        }
      },
    });
  }

  public viewSubmotivoMovimiento(
    submotivoMovimiento: ISubmotivoMovimiento
  ): void {
    this.dialog.open(AddEditSubmotivoMovimientoComponent, {
      data: {
        title: `VER SUBMOTIVO DE MOVIMIENTO`,
        edit: false,
        par_modo: 'R',
        movimiento: submotivoMovimiento?.movimiento,
        codigo_motivo: submotivoMovimiento?.codigo_motivo,
        producto: this.descripcion_producto,
        codigo_producto: submotivoMovimiento?.producto,
        codigo_submotivo: submotivoMovimiento?.codigo_submotivo,
        descripcion: submotivoMovimiento?.descripcion,
        fecha_vigencia: submotivoMovimiento?.fecha_vigencia,
      },
    });
  }

  public deleteSubmotivoMovimiento(
    SubmotivoMovimiento: ISubmotivoMovimiento
  ): void {
    let bodyDel = {
      par_modo: 'D',
      movimiento: SubmotivoMovimiento?.movimiento,
      codigo_motivo: SubmotivoMovimiento?.codigo_motivo,
      producto: SubmotivoMovimiento?.producto,
      codigo_producto: SubmotivoMovimiento?.codigo_producto,
      codigo_submotivo: SubmotivoMovimiento?.codigo_submotivo,
      fecha_vigencia: this.fecha(),
    };
    this.utils.openLoading();
    this.SubmotivoMovimientoService.CRUD(
      JSON.stringify(bodyDel)
    ).subscribe({
      next: () => {
        this.utils.notification(
          'El submotivo se ha eliminado extiosamente. ',
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
        setTimeout(() => {
          this.getSubmotivoMovimiento();
        }, 300);
      },
    });
  }

  // * modifica la fecha a numero
  private fecha(): number {
    let auxFecha: number;
    let ano = this.fecha_hoy.getFullYear().toString();
    let mes = (this.fecha_hoy.getMonth() + 1).toString();
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let dia = this.fecha_hoy.getDate().toString();
    if (dia.length == 1) {
      dia = '0' + dia;
    }
    auxFecha = parseInt(ano + mes + dia);
    return auxFecha;
  }

  public filter(): void {
    let Movimiento = this.SubmotivoMovimientoService.get();
    this.descripcion_producto = Movimiento.producto;
    this.searchProd = Movimiento.codigo_producto;
    this.searchMov = Movimiento.movimiento;
    this.searchCod_Mot = Movimiento.codigo_motivo;
    this.searchDescripcion = Movimiento.descripcion;
    this.getSubmotivoMovimiento();
  }
}

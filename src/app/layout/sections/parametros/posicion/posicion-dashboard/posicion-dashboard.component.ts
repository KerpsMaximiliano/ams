import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PosicionService } from 'src/app/core/services/posicion.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IPosicion } from 'src/app/core/models/posicion.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditPosicionDialogComponent } from '../add-edit-posicion-dialog/add-edit-posicion-dialog.component';

@Component({
  selector: 'app-posicion-dashboard',
  templateUrl: './posicion-dashboard.component.html',
  styleUrls: ['./posicion-dashboard.component.scss'],
})
export class PosicionDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() provincias: IProvincia[];

  public searchValue: string = '';
  public posicion: IPosicion[] = [];
  public displayedColumns: string[] = [
    'codigo_posicion',
    'descripcion',
    'domicilio',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<IPosicion>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private posicionService: PosicionService
  ) {}

  ngOnInit(): void {
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

  private getPosicion(): void {
    this.utils.openLoading();
    this.posicionService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.posicion = res.dataset as IPosicion[])
          : (this.posicion = [res.dataset]);
        this.dataSource = new MatTableDataSource<IPosicion>(this.posicion);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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

  public editPosicion(posicion: IPosicion): void {
    const modalPosicion = this.dialog.open(AddEditPosicionDialogComponent, {
      data: {
        title: `EDITAR POSICIÓN`,
        edit: true,
        par_modo: 'U',
        provincias: this.provincias,
        codigo_posicion: posicion?.codigo_posicion,
        descripcion: posicion?.descripcion,
        domicilio: posicion?.domicilio,
        codigo_postal: posicion?.codigo_postal,
        sub_codigo_postal: posicion?.sub_codigo_postal,
        control_rechazo: posicion?.control_rechazo,
        yes_no: posicion?.yes_no,
        fecha_vigencia: posicion?.fecha_vigencia,
        letra_provincia: posicion?.letra_provincia,
      },
    });

    modalPosicion.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.posicionService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El posición se ha editado extiosamente. ',
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
              this.editPosicion(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  codigo_posicion: res.codigo_posicion,
                });
                this.getPosicion();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewPosicion(posicion: IPosicion): void {
    this.dialog.open(AddEditPosicionDialogComponent, {
      data: {
        title: `VER POSICIÓN`,
        edit: false,
        par_modo: 'R',
        provincias: this.provincias,
        codigo_posicion: posicion?.codigo_posicion,
        descripcion: posicion?.descripcion,
        domicilio: posicion?.domicilio,
        codigo_postal: posicion?.codigo_postal,
        sub_codigo_postal: posicion?.sub_codigo_postal,
        control_rechazo: posicion?.control_rechazo,
        yes_no: posicion?.yes_no,
        fecha_vigencia: posicion?.fecha_vigencia,
        letra_provincia: posicion?.letra_provincia,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getPosicion();
  }
}

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';

// * Interfaces
import { Nacionalidad } from 'src/app/core/models/nacionalidad';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { EditNacionalidadDialogComponent } from '../edit-nacionalidad-dialog/edit-nacionalidad-dialog.component';

@Component({
  selector: 'app-nacionalidad-dashboard',
  templateUrl: './nacionalidad-dashboard.component.html',
  styleUrls: ['./nacionalidad-dashboard.component.scss'],
})
export class NacionalidadDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_nacionalidad_nuevo',
    'descripcion',
    'codigo_sistema_anterior',
    'actions',
  ];

  public dataSource: MatTableDataSource<Nacionalidad>;

  public searchEvent: string = '';
  public searchId: number = 0;
  public nacionalidades: Nacionalidad[] = [];

  constructor(
    private nacionalidadService: NacionalidadService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getNacionalidad(): void {
    this.utils.openLoading();
    let aux = {
      descripcion: this.searchEvent,
      id: this.searchId,
    };
    let body = JSON.stringify(aux);
    this.nacionalidadService.getParamByDesc(body).subscribe({
      next: (res: any) => {
        this.nacionalidades = res.dataset as Nacionalidad[];
        this.dataSource = new MatTableDataSource<Nacionalidad>(
          this.nacionalidades
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
          ? this.utils.notification('Error de conexion', 'error')
          : this.utils.notification(
              `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
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

  public editNacType(nacionalidad: Nacionalidad): void {
    const modalNacionalidad = this.dialog.open(
      EditNacionalidadDialogComponent,
      {
        data: {
          title: `Editar nacionalidad`,
          par_modo: 'U',
          id_tabla: 3,
          codigo_nacionalidad_nuevo: nacionalidad.codigo_nacionalidad_nuevo,
          descripcion: nacionalidad.descripcion,
          codigo_sistema_anterior: nacionalidad.codigo_sistema_anterior,
          edit: true,
        },
      }
    );

    modalNacionalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.nacionalidadService.editNacionalidad(res).subscribe({
            next: () => {
              this.utils.notification(
                'La nacionalidad se ha editado extiosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.editNacType(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getNacionalidad();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewNacType(nacionalidad: Nacionalidad): void {
    this.dialog.open(EditNacionalidadDialogComponent, {
      data: {
        title: `Ver nacionalidad`,
        id_tabla: 3,
        codigo_nacionalidad_nuevo: nacionalidad.codigo_nacionalidad_nuevo,
        descripcion: nacionalidad.descripcion,
        codigo_sistema_anterior: nacionalidad.codigo_sistema_anterior,
        edit: false,
      },
    });
  }

  public deleteNacType(nacionalidad: Nacionalidad): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar la nacionalidad`,
        message: `¿Está seguro de eliminar la nacionalidad ${nacionalidad.descripcion}?`,
      },
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.nacionalidadService
            .deleteEstado(nacionalidad.codigo_nacionalidad_nuevo)
            .subscribe({
              next: (res: any) => {
                this.utils.notification(
                  'La nacionalidad se ha borrado exitosamente',
                  'success'
                );
                this.getNacionalidad();
              },
              error: (err) => {
                this.utils.notification(
                  `Error al eliminar la nacionalidad: ${err.message}`,
                  'error'
                );
              },
            });
        }
      },
    });
  }

  public filter(buscar: any): void {
    this.searchEvent = buscar.descripcion;
    this.searchId = buscar.id;
    this.getNacionalidad();
  }
}

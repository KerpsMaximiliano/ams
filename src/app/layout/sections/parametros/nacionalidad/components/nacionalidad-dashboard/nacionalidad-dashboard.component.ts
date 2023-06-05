import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';

// * Interfaces
import { INacionalidad } from 'src/app/core/models/nacionalidad.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditNacionalidadDialogComponent } from '../add-edit-nacionalidad-dialog/add-edit-nacionalidad-dialog.component';

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

  public searchValue: string = '';
  public nacionalidad: INacionalidad[] = [];
  public displayedColumns: string[] = [
    'codigo_nacionalidad_nuevo',
    'descripcion',
    'codigo_sistema_anterior',
    'actions',
  ];

  public dataSource: MatTableDataSource<INacionalidad>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private nacionalidadService: NacionalidadService
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

  private getNacionalidad(): void {
    this.utils.openLoading();
    this.nacionalidadService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        this.nacionalidad = res.dataset as INacionalidad[];
        this.dataSource = new MatTableDataSource<INacionalidad>(
          this.nacionalidad
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
        setTimeout((res: any) => {
          this.searchValue = res?.codigo_nacionalidad_nuevo;
        }, 300);
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

  public editNacionalidad(nacionalidad: INacionalidad): void {
    const modalNacionalidad = this.dialog.open(
      AddEditNacionalidadDialogComponent,
      {
        data: {
          title: `EDITAR NACIONALIDAD`,
          edit: true,
          par_modo: 'U',
          codigo_nacionalidad_nuevo: nacionalidad.codigo_nacionalidad_nuevo,
          descripcion: nacionalidad.descripcion,
          codigo_sistema_anterior: nacionalidad.codigo_sistema_anterior,
        },
      }
    );

    modalNacionalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.nacionalidadService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La nacionalidad se ha editado extiosamente. ',
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
              this.editNacionalidad(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = res.codigo_nacionalidad_nuevo;
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewNacionalidad(nacionalidad: INacionalidad): void {
    this.dialog.open(AddEditNacionalidadDialogComponent, {
      data: {
        title: `VER NACIONALIDAD`,
        edit: false,
        par_modo: 'R',
        codigo_nacionalidad_nuevo: nacionalidad.codigo_nacionalidad_nuevo,
        descripcion: nacionalidad.descripcion,
        codigo_sistema_anterior: nacionalidad.codigo_sistema_anterior,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getNacionalidad();
  }
}

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EstadoCivilService } from 'src/app/core/services/estado-civil.service';

// * Interfaces
import { IEstadoCivil } from 'src/app/core/models/estado-civil.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditEstadoCivilDialogComponent } from '../add-edit-estado-civil-dialog/add-edit-estado-civil-dialog.component';

@Component({
  selector: 'app-estado-civil-dashboard',
  templateUrl: './estado-civil-dashboard.component.html',
  styleUrls: ['./estado-civil-dashboard.component.scss'],
})
export class EstadoCivilDashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);

  public searchValue: string = '';
  public estadoCivil: IEstadoCivil[] = [];
  public displayedColumns: string[] = [
    'codigo_estado_civil',
    'description',
    'actions',
  ];
  public dataSource: MatTableDataSource<IEstadoCivil>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private estadoCivilService: EstadoCivilService
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

  private getEstadoCivil(): void {
    this.utils.openLoading();
    this.estadoCivilService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.estadoCivil = res.dataset as IEstadoCivil[])
          : (this.estadoCivil = [res.dataset]);
        this.dataSource = new MatTableDataSource<IEstadoCivil>(
          this.estadoCivil
        );
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

  public editEstadoCivil(estadoCivil: IEstadoCivil): void {
    const modalNuevoEstadoCivil = this.dialog.open(
      AddEditEstadoCivilDialogComponent,
      {
        data: {
          title: `EDITAR ESTADO CIVIL`,
          edit: true,
          par_modo: 'U',
          codigo_estado_civil: estadoCivil.codigo_estado_civil,
          description: estadoCivil.description,
        },
      }
    );

    modalNuevoEstadoCivil.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.estadoCivilService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El estado civil se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.editEstadoCivil(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  codigo_estado_civil: res.codigo_estado_civil,
                });
                this.getEstadoCivil();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewEstadoCivil(estadoCivil: IEstadoCivil): void {
    this.dialog.open(AddEditEstadoCivilDialogComponent, {
      data: {
        title: `VER ESTADO CIVIL`,
        edit: false,
        par_modo: 'R',
        codigo_estado_civil: estadoCivil?.codigo_estado_civil,
        description: estadoCivil?.description,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getEstadoCivil();
  }
}

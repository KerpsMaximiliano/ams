import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EstadoCivilService } from 'src/app/core/services/estado-civil.service';

// * Interfaces
import { EstadoCivil } from 'src/app/core/models/estado-civil';

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
export class EstadoCivilDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = ['codigo_estado_civil', 'description', 'actions'];

  public dataSource: MatTableDataSource<EstadoCivil>;

  public searchValue: string = '';

  public estadoCivil: EstadoCivil[] = [];

  constructor(
    private estadoCivilService: EstadoCivilService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
  }

  private getEstadoCivil(): void {
    this.utils.openLoading();
    this.estadoCivilService.getEstadoCivilCRUD(this.searchValue).subscribe({
      next: (res: any) => {
        (res.dataset.length)
          ? this.estadoCivil = res.dataset as EstadoCivil[]
          : this.estadoCivil = [res.dataset];
        this.dataSource = new MatTableDataSource<EstadoCivil>(this.estadoCivil);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          // Permite calcular la cantidad total de páginas.
          const totalPages = Math.ceil(
            this.estadoCivil.length / this.paginator.pageSize
          );
    
          this.paginator.length = totalPages;
    
          this.paginator._intl.getRangeLabel = (): string => {
            return ( 'Página ' + (this.paginator.pageIndex + 1) + ' de ' + totalPages );
          }, 100});
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

  public editEstadoCivil(estadoCivil: EstadoCivil): void {
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
          this.estadoCivilService.getEstadoCivilCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Estado Civil se ha editado extiosamente. ',
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
              this.editEstadoCivil(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getEstadoCivil();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewEstadoCivil(estadoCivil: EstadoCivil): void {
    this.dialog.open(AddEditEstadoCivilDialogComponent, {
      data: {
        title: `VER ESTADO CIVIL`,
        edit: false,
        par_modo: 'C',
        codigo_estado_civil: estadoCivil?.codigo_estado_civil,
        description: estadoCivil?.description,
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getEstadoCivil();
  }
}

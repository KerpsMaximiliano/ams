import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';

// * Interfaces
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditDepartamentoDialogComponent } from '../add-edit-departamento-dialog/add-edit-departamento-dialog.component';

@Component({
  selector: 'app-departamento-dashboard',
  templateUrl: './departamento-dashboard.component.html',
  styleUrls: ['./departamento-dashboard.component.scss'],
})
export class DepartamentoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() provincias: IProvincia[];

  public searchValue: string = '';
  public departamento: IDepartamento[] = [];
  public displayedColumns: string[] = [
    'codigo_departamento',
    'descripcion',
    'descripcion_reducida',
    'actions',
  ];
  public dataSource: MatTableDataSource<IDepartamento>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private departamentoService: DepartamentoService
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

  private getDepartamento(): void {
    this.utils.openLoading();
    this.departamentoService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.departamento = res.dataset as IDepartamento[])
          : (this.departamento = [res.dataset]);
        this.dataSource = new MatTableDataSource<IDepartamento>(
          this.departamento
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

  public editDepartamento(departamento: IDepartamento): void {
    const modalNuevoDepartamento = this.dialog.open(
      AddEditDepartamentoDialogComponent,
      {
        data: {
          title: `EDITAR DEPARTAMENTO`,
          edit: true,
          par_modo: 'U',
          letra_provincia: departamento?.letra_provincia,
          codigo_departamento: departamento?.codigo_departamento,
          descripcion: departamento?.descripcion,
          descripcion_reducida: departamento?.descripcion_reducida,
          provincias: this.provincias,
        },
      }
    );

    modalNuevoDepartamento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.departamentoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El departamento se ha editado extiosamente. ',
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
              this.editDepartamento(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  letra_provincia: res.letra_provincia,
                  codigo_departamento: res.codigo_departamento,
                });
                this.getDepartamento();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewDepartamento(departamento: IDepartamento): void {
    this.dialog.open(AddEditDepartamentoDialogComponent, {
      data: {
        title: `VER DEPARTAMENTO`,
        edit: false,
        par_modo: 'R',
        letra_provincia: departamento.letra_provincia,
        codigo_departamento: departamento?.codigo_departamento,
        descripcion: departamento?.descripcion,
        descripcion_reducida: departamento?.descripcion_reducida,
        provincias: this.provincias,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getDepartamento();
  }
}

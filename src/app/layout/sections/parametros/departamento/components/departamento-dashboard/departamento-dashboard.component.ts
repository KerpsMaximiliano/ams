import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import {
  IProvincia,
  IProvinciaResponse,
} from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditDepartamentoDialogComponent } from '../add-edit-departamento-dialog/add-edit-departamento-dialog.component';

export interface searchValue {
  descripcion: Number;
  letra_provincia: string;
}

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

  public searchValue: searchValue;
  provinciaList: IProvincia[];
  public departamentos: IDepartamento[] = [];
  provincias$: Observable<IProvinciaResponse>;
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
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService
  ) {}

  ngOnInit(): void {
    this.provincias$ = this.provinciaService.provinciaList;
    this.provincias$.subscribe({
      next: (data) => {
        this.provinciaList = data.dataset;
      },
      error: (err) => {
        this.utils.notification(
          `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
          'error'
        );
      },
    });
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
    let body = {
      par_modo: 'O',
      letra_provincia: this.searchValue.letra_provincia,
      // codigo_departamento: null,
      descripcion: this.searchValue.descripcion,
      // descripcion_reducida: '',
    };
    this.departamentoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.departamentos = res.dataset as IDepartamento[])
          : (this.departamentos = [res.dataset]);
        this.dataSource = new MatTableDataSource<IDepartamento>(
          this.departamentos
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
          letra_provincia: departamento.letra_provincia,
          codigo_departamento: departamento?.codigo_departamento,
          descripcion: departamento?.descripcion,
          descripcion_reducida: departamento?.descripcion_reducida,
          nombre_provincia: this.provinciaList.find(
            (provincia) => provincia.codigo
          )?.nombre_provincia,
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
                this.searchValue.letra_provincia = res.letra_provincia;
                this.searchValue.descripcion = res.descripcion;
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
        letra_provincia: departamento.letra_provincia,
        codigo_departamento: departamento?.codigo_departamento,
        descripcion: departamento?.descripcion,
        descripcion_reducida: departamento?.descripcion_reducida,
        nombre_provincia: this.provinciaList.find(
          (provincia) => provincia.codigo
        )?.nombre_provincia,
      },
    });
  }

  public filter(data: searchValue): void {
    this.searchValue = data;
    this.getDepartamento();
  }
}

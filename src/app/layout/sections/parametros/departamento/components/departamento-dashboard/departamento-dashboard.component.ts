import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditDepartamentoDialogComponent } from '../add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import {
  IProvincia,
  IProvinciaResponse,
} from 'src/app/core/models/provincia.interface';
import { Observable } from 'rxjs';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

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

  public displayedColumns: string[] = [
    'codigo_departamento',
    'departamento',
    'abreviatura',
    'actions',
  ];

  public dataSource: MatTableDataSource<IDepartamento>;
  provincias$: Observable<IProvinciaResponse>;
  provinciaList: IProvincia[];

  public searchValue: searchValue;
  public departamentos: IDepartamento[] = [];

  constructor(
    private departamentoService: DepartamentoService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
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
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getDepartamento(): void {
    this.utils.openLoading();
    let body = {
      par_modo: 'C',
      letra_provincia: this.searchValue.letra_provincia,
      codigo_departamento: null,
      descripcion: this.searchValue.descripcion,
      descripcion_reducida: '',
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
          par_modo: 'U',
          letra_provincia: departamento.letra_provincia,
          codigo_departamento: departamento?.codigo_departamento,
          descripcion: departamento?.descripcion,
          descripcion_reducida: departamento?.descripcion_reducida,
          edit: true,
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
                'El Departamento se ha editado extiosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
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
        id_tabla: 10,
        letra_provincia: departamento.letra_provincia,
        codigo_departamento: departamento?.codigo_departamento,
        descripcion: departamento?.descripcion,
        descripcion_reducida: departamento?.descripcion_reducida,
        edit: false,
        nombre_provincia: this.provinciaList.find(
          (provincia) => provincia.codigo
        )?.nombre_provincia,
      },
    });
  }

  public filter(buscar: searchValue): void {
    this.searchValue = buscar;
    this.getDepartamento();
  }
}

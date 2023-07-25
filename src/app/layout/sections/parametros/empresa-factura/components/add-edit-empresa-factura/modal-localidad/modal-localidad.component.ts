import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Interfaces
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import { ILocalidad } from 'src/app/core/models/localidad.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { HtmlTagDefinition } from '@angular/compiler';

@Component({
  selector: 'app-modal-localidad',
  templateUrl: './modal-localidad.component.html',
  styleUrls: ['./modal-localidad.component.scss'],
})
export class ModalLocalidadComponent {
  @Component({
    selector: 'app-posicion-set-dialog',
    templateUrl: './posicion-set-dialog.component.html',
    styleUrls: ['./posicion-set-dialog.component.scss'],
  })
  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    'actions',
  ];
  public dataSource: MatTableDataSource<ILocalidad>;
  public departamentos: IDepartamento[];
  public localidades: ILocalidad[];
  public localidad: any;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  public provincias: any;
  public departamento: any;

  constructor(
    private provinciaService: ProvinciaService,
    private departamentoService: DepartamentoService,
    private localidadService: LocalidadService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadProvincia();
  }

  ngOnInit(): void {
    this.configurePaginator();
  }

  public loadProvincia(): void {
    this.utils.openLoading();
    this.provinciaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          nombre_provincia: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.provincias = res.dataset as IProvincia[])
            : (this.provincias = [res.dataset]);
        },
        error: () => {
          this.utils.closeLoading();
          this.provincias.value = 'No se encontraron provincias. ';
        },
        complete: () => {
          this.utils.closeLoading();
        },
      });
  }

  public loadDepartamentos(provincia: IProvincia): void {
    this.utils.openLoading();
    this.departamentoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          letra_provincia: provincia.codigo,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.departamentos = res.dataset as IDepartamento[])
            : (this.departamentos = [res.dataset]);
        },
        error: () => {
          this.utils.closeLoading();
          this.departamento.value = 'No se encontraron departamentos. ';
        },
        complete: () => {
          this.utils.closeLoading();
        },
      });
  }

  public getLocalidades(provincia: string, departamento: number): void {
    this.localidad = null;
    this.utils.openLoading();
    this.localidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          letra_provincia: provincia,
          codigo_departamento: departamento,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.localidades = Array.isArray(res.dataset)
            ? (res.dataset as ILocalidad[])
            : res.dataset
            ? [res.dataset as ILocalidad]
            : [];
          this.dataSource = new MatTableDataSource<ILocalidad>(
            this.localidades
          );
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          this.utils.closeLoading();
          if (err.status === 404) {
            this.localidades = [];
            this.dataSource = new MatTableDataSource<ILocalidad>(
              this.localidades
            );
            this.dataSource.paginator = this.paginator;
          } else {
            const errorMessage =
              err.status === 0
                ? 'Error de conexión.'
                : `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`;
            this.utils.notification(errorMessage, 'error');
          }
        },
        complete: () => {
          this.dataSource = new MatTableDataSource<ILocalidad>(
            this.localidades
          );
          this.dataSource.paginator = this.paginator;
          this.utils.closeLoading();
        },
      });
  }

  public confirm(): void {
    this.dialogRef.close({
      descripcion: this.localidad.descripcion,
      codigo_postal: this.localidad.codigo_postal,
      sub_codigo_postal: this.localidad.sub_codigo_postal,
    });
  }

  public clear(provincia: HTMLSelectElement, departamento: HTMLSelectElement) {
    provincia.value = '';
    departamento.value = '';
  }

  public applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
  }

  private configurePaginator(): void {
    this.paginator._intl = this.matPaginatorIntl;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Última página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? `Página ${page + 1} de ${Math.ceil(length / pageSize)}`
        : 'Página 0 de 0';
    };
  }
}

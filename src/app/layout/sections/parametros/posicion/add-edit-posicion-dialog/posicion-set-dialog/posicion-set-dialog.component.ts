import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
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
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-posicion-set-dialog',
  templateUrl: './posicion-set-dialog.component.html',
  styleUrls: ['./posicion-set-dialog.component.scss'],
})
export class PosicionSetDialogComponent implements OnInit {
  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    'actions',
  ];
  public dataSource: MatTableDataSource<ILocalidad>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  @ViewChild('selectProvincia') selectProvincia: any;
  @ViewChild('selectDepartamento') selectDepartamento: any;

  public departamentos: IDepartamento[];
  public localidades: ILocalidad[];

  public showGuardarButton: any;

  constructor(
    private departamentoService: DepartamentoService,
    private localidadService: LocalidadService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  public loadDepartamentos(): void {
    this.utils.openLoading();
    this.departamentoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          letra_provincia: this.selectProvincia.value,
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
          this.selectDepartamento.value = 'No se encontraron departamentos. ';
        },
        complete: () => {
          this.utils.closeLoading();
        },
      });
  }

  public getLocalidades(): void {
    this.showGuardarButton = null;
    this.utils.openLoading();
    this.localidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          letra_provincia: this.selectProvincia?.value,
          codigo_departamento: this.selectDepartamento?.value,
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
      letra_provincia: this.showGuardarButton.letra_provincia,
      descripcion: this.showGuardarButton.descripcion,
      codigo_postal: this.showGuardarButton.codigo_postal,
      sub_codigo_postal: this.showGuardarButton.sub_codigo_postal,
    });
  }

  public clear() {
    this.selectProvincia.value = '';
    this.selectDepartamento.value = '';
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

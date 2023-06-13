import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import { LocalidadService } from 'src/app/core/services/localidad.service';
import { ILocalidad } from 'src/app/core/models/localidad.interface';

@Component({
  selector: 'app-posicion-set-dialog',
  templateUrl: './posicion-set-dialog.component.html',
  styleUrls: ['./posicion-set-dialog.component.scss'],
})
export class PosicionSetDialogComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('selectProvincia') selectProvincia: any;
  @ViewChild('selectDepartamento') selectDepartamento: any;
  public provincias: IProvincia[];
  public departamentos: IDepartamento[];
  public localidades: ILocalidad[];

  selectedLocalidad: any;
  showGuardarButton: any;

  public searchValue: string = '';
  // public posicion: IPosicion[] = [];
  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    'actions',
  ];
  public dataSource: MatTableDataSource<any>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private departamentoService: DepartamentoService,
    private localidadService: LocalidadService
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

    this.provincias = this.data.provincias;
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
          this.selectDepartamento.focus();
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
          res.dataset.length
            ? (this.localidades = res.dataset as ILocalidad[])
            : (this.localidades = [res.dataset]);
          this.dataSource = new MatTableDataSource<ILocalidad>(
            this.localidades
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
}

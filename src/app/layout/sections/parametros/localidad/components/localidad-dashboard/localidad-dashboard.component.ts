import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Interfaces
import { ILocalidad } from 'src/app/core/models/localidad.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditLocalidadDialogComponent } from '../add-edit-localidad-dialog/add-edit-localidad-dialog.component';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-localidad-dashboard',
  templateUrl: './localidad-dashboard.component.html',
  styleUrls: ['./localidad-dashboard.component.scss'],
})
export class LocalidadDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchText: string;
  public searchId: string;
  public searchDep: string;
  public searchLetra: string;
  public localidades: ILocalidad[] = [];
  public displayedColumns: string[] = [
    'Codigo',
    'Localidad',
    'Provincia',
    'Departamento',
    'Posicion',
    'Habitantes',
    'actions',
  ];
  public dataSource: MatTableDataSource<ILocalidad>;

  paramProv: any;
  aux: any;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private localidadesService: LocalidadService
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

  private getLocalidad(): void {
    this.utils.openLoading();
    this.aux = {
      codigo_departamento: this.searchDep,
      letra_provincia: this.searchLetra,
      descripcion: this.searchText,
      codigo_postal: this.searchId,
    };
    if (this.aux.codigo_postal != '') {
      this.aux.par_modo = 'R';
      this.localidadesService.CRUD(JSON.stringify(this.aux)).subscribe({
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
    } else {
      this.aux.par_modo = 'C';
      this.localidadesService.CRUD(JSON.stringify(this.aux)).subscribe({
        next: (res: any) => {
          this.localidades = res.dataset as ILocalidad[];
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
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editLocalidad(localidad: ILocalidad): void {
    const modalNuevoLocalidad = this.dialog.open(
      AddEditLocalidadDialogComponent,
      {
        data: {
          title: `EDITAR LOCALIDAD`,
          edit: true,
          par_modo: 'U',
          id_tabla: 8,
          codigo_postal: localidad?.codigo_postal,
          sub_codigo_postal: localidad?.sub_codigo_postal,
          descripcion: localidad?.descripcion,
          letra_provincia: localidad?.letra_provincia,
          flete_transporte: localidad?.flete_transporte,
          posicion_referente: localidad?.posicion_referente,
          visitado_auditor: localidad?.visitado_auditor,
          zona_promocion: localidad?.zona_promocion,
          codigo_departamento: localidad?.codigo_departamento,
          desc_depto: localidad?.desc_depto,
          zona_envio: localidad?.zona_envio,
          ingreso_ticket: localidad?.ingreso_ticket,
          cant_habitantes: localidad?.cant_habitantes,
        },
      }
    );

    modalNuevoLocalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.localidadesService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La localidad se ha editado extiosamente. ',
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
              this.editLocalidad(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getLocalidad();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewLocalidad(AbmLocalidades: ILocalidad): void {
    this.dialog.open(AddEditLocalidadDialogComponent, {
      data: {
        title: `VER LOCALIDAD`,
        edit: false,
        id_tabla: 8,
        codigo_postal: AbmLocalidades?.codigo_postal,
        sub_codigo_postal: AbmLocalidades?.sub_codigo_postal,
        descripcion: AbmLocalidades?.descripcion,
        letra_provincia: AbmLocalidades?.letra_provincia,
        flete_transporte: AbmLocalidades?.flete_transporte,
        posicion_referente: AbmLocalidades?.posicion_referente,
        visitado_auditor: AbmLocalidades?.visitado_auditor,
        zona_promocion: AbmLocalidades?.zona_promocion,
        codigo_departamento: AbmLocalidades?.codigo_departamento,
        zona_envio: AbmLocalidades?.zona_envio,
        ingreso_ticket: AbmLocalidades?.ingreso_ticket,
        cant_habitantes: AbmLocalidades?.cant_habitantes,
      },
    });
  }

  public deleteLocalidad(localidad: ILocalidad): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `ELIMINAR LOCALIDAD`,
        message: `¿Está seguro de eliminar la localidad ${localidad.descripcion}?`,
      },
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.localidadesService.CRUD(localidad.codigo_postal).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La localidad se ha borrado exitosamente. ',
                'success'
              );
              this.getLocalidad();
            },
            error: (err) => {
              this.utils.notification(
                `Error al borrar la localidad: ${err.message}. `,
                'error'
              );
            },
          });
        }
      },
    });
  }

  public filter(buscar: any): void {
    this.searchId = buscar.codigo_postal;
    this.searchLetra = buscar.letra_provincia;
    this.searchDep = buscar.codigo_departamento;
    this.searchText = buscar.descripcion;
    this.searchLetra != '' || this.searchDep != ''
      ? this.getLocalidad()
      : (this.dataSource.data = []);
  }
}

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ILocalidad } from 'src/app/core/models/localidad.interface';
import { LocalidadesService } from 'src/app/core/services/abm-localidades.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EditAbmLocalidadesDialogComponent } from '../abm-localidades-dialog/edit-abm-localidades-dialog.component';
@Component({
  selector: 'app-abm-localidades-dashboard',
  templateUrl: './abm-localidades-dashboard.component.html',
  styleUrls: ['./abm-localidades-dashboard.component.scss'],
})
export class AbmLocalidadesDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

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
  public searchText: string;
  public searchId: string;
  public searchDep: string;
  public searchLetra: string;
  public localidades: ILocalidad[] = [];
  paramProv: any;
  aux: any;

  constructor(
    private LocalidadesService: LocalidadesService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getAbmLocalidades(): void {
    this.utils.openLoading();
    this.aux = {
      codigo_departamento: this.searchDep,
      letra_provincia: this.searchLetra,
      descripcion: this.searchText,
      codigo_postal: this.searchId,
    };
    if (this.aux.codigo_postal != '') {
      this.aux.par_modo = 'R';
      this.LocalidadesService.getCRUD(JSON.stringify(this.aux)).subscribe({
        next: (res: any) => {
          console.log(res);
          res.dataset.length
            ? (this.localidades = res.dataset as ILocalidad[])
            : (this.localidades = [res.dataset]);
          this.dataSource = new MatTableDataSource<ILocalidad>(
            this.localidades
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
          console.log(err);

          err.status == 0
            ? this.utils.notification('Error de conexion', 'error')
            : this.utils.notification(
                `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utils.closeLoading();
        },
      });
    } else {
      this.aux.par_modo = 'C';
      this.LocalidadesService.getCRUD(JSON.stringify(this.aux)).subscribe({
        next: (res: any) => {
          this.localidades = res.dataset as ILocalidad[];
          this.dataSource = new MatTableDataSource<ILocalidad>(
            this.localidades
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
          console.log(err);

          err.status == 0
            ? this.utils.notification('Error de conexion', 'error')
            : this.utils.notification(
                `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
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

  public editLocalType(AbmLocalidades: ILocalidad): void {
    const modalNuevoAbmLocalidades = this.dialog.open(
      EditAbmLocalidadesDialogComponent,
      {
        data: {
          title: `Editar Localidad`,
          par_modo: 'U',
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
          desc_depto: AbmLocalidades?.desc_depto,
          zona_envio: AbmLocalidades?.zona_envio,
          ingreso_ticket: AbmLocalidades?.ingreso_ticket,
          cant_habitantes: AbmLocalidades?.cant_habitantes,
          edit: true,
        },
      }
    );

    modalNuevoAbmLocalidades.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          console.log(res);

          this.utils.openLoading();
          this.LocalidadesService.getCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Localidades se ha editado extiosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              console.log(err.error.returnset.Mensaje);

              this.editLocalType(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getAbmLocalidades();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewLocalType(AbmLocalidades: ILocalidad): void {
    this.dialog.open(EditAbmLocalidadesDialogComponent, {
      data: {
        title: `Ver Localidad`,
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
        edit: false,
      },
    });
  }

  public deleteLocalType(tipoLocal: ILocalidad): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Localidad`,
        message: `¿Está seguro de eliminar el Localidad ${tipoLocal.descripcion}?`,
      },
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.LocalidadesService.getCRUD(tipoLocal.codigo_postal).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'El Localidades se ha borrado exitosamente',
                'success'
              );
              this.getAbmLocalidades();
            },
            error: (err) => {
              this.utils.notification(
                `Error al borrar Localidades: ${err.message}`,
                'error'
              );
              console.log(err.message);
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
    console.log(
      'codigo_postal',
      this.searchId,
      'letra_provincia',
      this.searchLetra,
      'codigo_departamento',
      this.searchDep,
      'descripcion',
      this.searchText
    );

    this.searchLetra != '' || this.searchDep != ''
      ? this.getAbmLocalidades()
      : (this.dataSource.data = []);
  }
}

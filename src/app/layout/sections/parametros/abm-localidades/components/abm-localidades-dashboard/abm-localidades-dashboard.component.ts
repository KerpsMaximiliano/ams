import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { AbmLocalidades } from 'src/app/core/models/abm-localidades';
import { LocalidadesService } from 'src/app/core/services/abm-localidades.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EditAbmLocalidadesDialogComponent } from '../abm-localidades-dialog/edit-abm-localidades-dialog.component'; 
@Component({
  selector: 'app-abm-localidades-dashboard',
  templateUrl: './abm-localidades-dashboard.component.html',
  styleUrls: ['./abm-localidades-dashboard.component.scss']
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
    'actions'
  ];

  public dataSource: MatTableDataSource<AbmLocalidades>;
  public searchText: string;
  public searchId: string;
  public localidades: AbmLocalidades[] = [];

  constructor(private LocalidadesService: LocalidadesService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getAbmLocalidades(): void {
    this.utils.openLoading();
    let aux = {
      codigo: this.searchId,
      nombre_localidad: this.searchText,
    }
    let body = JSON.stringify(aux)
    this.LocalidadesService.getParamByDesc(body).subscribe({
      next:(res:any) => {
        this.localidades = res.dataset as AbmLocalidades[];
        this.dataSource = new MatTableDataSource<AbmLocalidades>(this.localidades);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " +  (this.paginator.pageIndex + 1) + " de " +  this.paginator.length
          }
        }, 100)
      },
      error:(err: any) => {
        this.utils.closeLoading();
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      },
      complete: () => {
        this.utils.closeLoading();
      }
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editLocalType(AbmLocalidades: AbmLocalidades): void {
    const modalNuevoAbmLocalidades = this.dialog.open(EditAbmLocalidadesDialogComponent, {
      data: {
        title: `Editar Localidad`,
        par_modo: "U",
        id_tabla: 8,
        codigo: AbmLocalidades?.codigo,
        subcodigo: AbmLocalidades?.subcodigo,
        nombre_localidad:AbmLocalidades?.nombre_localidad,
        letra_provincia:AbmLocalidades?.letra_provincia,
        flete_transportista: AbmLocalidades?.flete_transportista,
        referente: AbmLocalidades?.referente,
        medico: AbmLocalidades?.medico,
        zona_promocion: AbmLocalidades?.zona_promocion,
        cod_departamento: AbmLocalidades?.cod_departamento,
        zona_envio: AbmLocalidades?.zona_envio,
        ticket: AbmLocalidades?.ticket,
        zona_atencion: AbmLocalidades?.zona_atencion,
        habitantes: AbmLocalidades?.habitantes,
        edit: true
      }
    });

    modalNuevoAbmLocalidades.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.LocalidadesService.editLocalType(res).subscribe({
            next: () => {
              this.utils.notification("La Localidades se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editLocalType(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getAbmLocalidades();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewLocalType(AbmLocalidades: AbmLocalidades): void {
    this.dialog.open(EditAbmLocalidadesDialogComponent, {
      data: {
        title: `Ver Localidad`,
        id_tabla: 8,
        codigo: AbmLocalidades?.codigo,
        subcodigo: AbmLocalidades?.subcodigo,
        nombre_localidad:AbmLocalidades?.nombre_localidad,
        letra_provincia:AbmLocalidades?.letra_provincia,
        flete_transportista: AbmLocalidades?.flete_transportista,
        referente: AbmLocalidades?.referente,
        medico: AbmLocalidades?.medico,
        zona_promocion: AbmLocalidades?.zona_promocion,
        cod_departamento: AbmLocalidades?.cod_departamento,
        zona_envio: AbmLocalidades?.zona_envio,
        ticket: AbmLocalidades?.ticket,
        zona_atencion: AbmLocalidades?.zona_atencion,
        habitantes: AbmLocalidades?.habitantes,
        edit: false
      }
    });
  }


  public deleteLocalType(tipoLocal: AbmLocalidades): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Localidad`,
        message: `¿Está seguro de eliminar el Localidad ${tipoLocal.nombre_localidad}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.LocalidadesService.deleteEstado(tipoLocal.codigo).subscribe({
            next: (res: any) => {
              this.utils.notification("El Localidades se ha borrado exitosamente", 'success')
              this.getAbmLocalidades();
            },
            error: (err) => {
              this.utils.notification(`Error al borrar Localidades: ${err.message}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(buscar: any):void {    
    this.searchText = buscar.nombre_localidad;
    this.searchId = buscar.codigo;
    (this.searchText != "" || this.searchId != '')
      ? this.getAbmLocalidades()
      : this.dataSource.data = [] 
  }
}
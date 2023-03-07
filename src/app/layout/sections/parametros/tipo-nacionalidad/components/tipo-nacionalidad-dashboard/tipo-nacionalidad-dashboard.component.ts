import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { TipoNacionalidad } from 'src/app/core/models/tipo-nacionalidad';
import { EstadosService } from 'src/app/core/services/estados.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EditTipoNacionalidadDialogComponent } from '../edit-tipo-nacionalidad-dialog/edit-tipo-nacionalidad-dialog.component'; 
@Component({
  selector: 'app-tipo-nacionalidad-dashboard',
  templateUrl: './tipo-nacionalidad-dashboard.component.html',
  styleUrls: ['./tipo-nacionalidad-dashboard.component.scss']
})
export class TipoNacionalidadDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_nacionalidad',
    'descripcion',
    'codigo_sistema_anterior',
    'actions'
  ];

  public dataSource: MatTableDataSource<TipoNacionalidad>;

  public searchText: string = "";

  public states: TipoNacionalidad[] = [];

  constructor(private EstadosService: EstadosService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getTipoNacionalidad(): void {
    this.utils.openLoading();
    let aux = {
      descripcion: this.searchText
    }
    let body = JSON.stringify(aux)
    this.EstadosService.getParamByDesc(body).subscribe({
      next:(res:any) => {
        console.log (res)
        this.states = res.dataset as TipoNacionalidad[];
        this.dataSource = new MatTableDataSource<TipoNacionalidad>(this.states);
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
        this.utils.notification(`Error al obtener Estados: ${err.message}`, 'error')
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

  public editDocType(TipoNacionalidad: TipoNacionalidad): void {
    const modalNuevoTipoNacionalidad = this.dialog.open(EditTipoNacionalidadDialogComponent, {
      data: {
        title: `Editar Nacionalidad`,
        par_modo: "U",
        id_tabla: 3,
        codigo_nacionalidad: TipoNacionalidad.codigo_nacionalidad,
        descripcion: TipoNacionalidad.descripcion,
        codigo_sistema_anterior: TipoNacionalidad.codigo_sistema_anterior,
        edit: true
      }
    });

    modalNuevoTipoNacionalidad.afterClosed().subscribe({
      next:(res) => {
        this.utils.openLoading();
        this.EstadosService.editEstado(res).subscribe({
          next: () => {
            this.utils.notification("La Nacionalidad se ha editado extiosamente", 'success')
          },
          error: (err) => {
            this.utils.closeLoading();
            console.log(err.error);
            
            this.utils.notification(`Error al editar la Nacionalidad: ${err.error.message}`, 'error')
          },
          complete: () => {
            this.utils.closeLoading();
            setTimeout(() => {
              this.getTipoNacionalidad();
            }, 300);
          }
        });
      }
    });
  }

  public viewDocType(TipoNacionalidad: TipoNacionalidad): void {
    this.dialog.open(EditTipoNacionalidadDialogComponent, {
      data: {
        title: `Ver Documento`,
        par_modo: "U",
        id_tabla: 3,
        codigo_nacionalidad: TipoNacionalidad.codigo_nacionalidad,
        descripcion: TipoNacionalidad.descripcion,
        codigo_sistema_anterior: TipoNacionalidad.codigo_sistema_anterior,
        edit: false
      }
    });
  }


  public deleteDocType(tipoNac: TipoNacionalidad): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Documento`,
        message: `¿Está seguro de eliminar el documento ${tipoNac.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.EstadosService.deleteEstado(tipoNac.codigo_nacionalidad).subscribe({
            next: (res: any) => {
              this.utils.notification("El Documento se ha borrado exitosamente", 'success')
              this.getTipoNacionalidad();
            },
            error: (err) => {
              this.utils.notification(`Error al borrar Documento: ${err.message}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(text: any):void {
    this.searchText = text;
    (this.searchText != "")
      ? this.getTipoNacionalidad()
      : this.dataSource.data = [] 
  }
}
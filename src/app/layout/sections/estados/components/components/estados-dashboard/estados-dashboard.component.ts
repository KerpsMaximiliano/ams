import { UtilService } from './../../../../../../core/services/util.service';
import { EstadosService } from './../../../../../../core/services/estados.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Estado } from 'src/app/core/models/estado';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { AddEditEstadoDialogComponent } from '../../add-edit-estado-dialog/add-edit-estado-dialog.component';

@Component({
  selector: 'app-estados-dashboard',
  templateUrl: './estados-dashboard.component.html',
  styleUrls: ['./estados-dashboard.component.scss']
})
export class EstadosDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'description',
    'actions',
  ];

  public dataSource!: MatTableDataSource<Estado>;

  public searchText: string = "";

  public states: Estado[] = [];

  constructor(private estadosService: EstadosService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getEstados();
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getEstados(): void {
    this.utils.openLoading();
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize ?? 10;
    this.estadosService.getEstados(pageIndex, pageSize, this.searchText).subscribe({
      next:(res:any) => {
        this.states = res.content as Estado[];
        this.dataSource = new MatTableDataSource<Estado>(this.states);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.length = res.totalElements
          this.paginator.pageIndex = res.pageable.pageNumber;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " +  (res.pageable.pageNumber+1) + " de " + res.totalPages
          }
        }, 100)
      },
      error:(err: any) => {
        this.utils.closeLoading();
        this.utils.notification(`Error al obtener estados: ${err.message}`, 'error')
      },
      complete: () => {
        this.utils.closeLoading();
      }
    });
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editState(estado: Estado): void {
    const modalNuevoEstado = this.dialog.open(AddEditEstadoDialogComponent, {
      data: {
        title: `Editar Estado`,
        id: estado.id,
        descripcion: estado.descripcion
      }
    });

    modalNuevoEstado.afterClosed().subscribe({
      next:(res) => {
        if (res && res.descripcion.length > 0) {
          this.utils.openLoading();
          this.estadosService.editEstado(res).subscribe({
            next: () => {
              this.utils.notification("El estado se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              this.utils.notification(`Error al editar estado: ${err.error.message}`, 'error')
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getEstados();
              }, 300);
            }
          });
        }
      }
    });
  }

  public deleteState(state: Estado): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Estado`,
        message: `¿Está seguro de eliminar el estado ${state.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.estadosService.deleteEstado(state.id).subscribe({
            next: (res: any) => {
              this.utils.notification("El estado se ha borrado exitosamente", 'success')
              this.getEstados();
            },
            error: (err) => {
              this.utils.notification(`Error al borrar estado: ${err.message}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(text: any):void {
    this.searchText = text;
    this.getEstados()
  }

}

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { TipoProvincia } from 'src/app/core/models/tipo-provincia';
import { ProvinciaService } from 'src/app/core/services/tipo-provincia.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EditTipoProvinciaDialogComponent } from '../edit-tipo-provincia-dialog/edit-tipo-provincia-dialog.component'; 
@Component({
  selector: 'app-tipo-provincia-dashboard',
  templateUrl: './tipo-provincia-dashboard.component.html',
  styleUrls: ['./tipo-provincia-dashboard.component.scss']
})
export class TipoProvinciaDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo',
    'nombre_provincia',
    'codigo_provincia',
    'codifica_altura',
    'flete_transportista',
    'actions'
  ];

  public dataSource: MatTableDataSource<TipoProvincia>;
  public searchText: string;
  public searchId: string;
  public provincia: TipoProvincia[] = [];

  constructor(private ProvinciaService: ProvinciaService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getTipoProvincia(): void {
    this.utils.openLoading();
    let aux = {
      codigo: this.searchId,
      nombre_provincia: this.searchText,
    }
    let body = JSON.stringify(aux)
    this.ProvinciaService.getParamByDesc(body).subscribe({
      next:(res:any) => {
        this.provincia = res.dataset as TipoProvincia[];
        this.dataSource = new MatTableDataSource<TipoProvincia>(this.provincia);
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

  public editProviType(tipoProvincia: TipoProvincia): void {
    const modalNuevoTipoProvincia = this.dialog.open(EditTipoProvinciaDialogComponent, {
      data: {
        title: `Editar Provincia`,
        par_modo: "U",
        id_tabla: 9,
        codigo: tipoProvincia?.codigo,
        nombre_provincia: tipoProvincia?.nombre_provincia,
        codifica_altura: tipoProvincia?.codifica_altura,
        codigo_provincia: tipoProvincia?.codigo_provincia,
        flete_transportista: tipoProvincia?.flete_transportista,
        edit: true
      }
    });

    modalNuevoTipoProvincia.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.ProvinciaService.editProviType(res).subscribe({
            next: () => {
              this.utils.notification("La Provincia se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editProviType(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getTipoProvincia();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewProvinType(tipoProvincia: TipoProvincia): void {
    this.dialog.open(EditTipoProvinciaDialogComponent, {
      data: {
        title: `Ver Provincia`,
        id_tabla: 9,
        codigo: tipoProvincia?.codigo,
        nombre_provincia: tipoProvincia?.nombre_provincia,
        codifica_altura: tipoProvincia?.codifica_altura,
        codigo_provincia: tipoProvincia?.codigo_provincia,
        flete_transportista: tipoProvincia?.flete_transportista,
        edit: false
      }
    });
  }


  public deleteProvinType(tipoProv: TipoProvincia): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Provincia`,
        message: `¿Está seguro de eliminar el Provincia ${tipoProv.nombre_provincia}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.ProvinciaService.deleteEstado(tipoProv.codigo).subscribe({
            next: (res: any) => {
              this.utils.notification("El Provincia se ha borrado exitosamente", 'success')
              this.getTipoProvincia();
            },
            error: (err) => {
              this.utils.notification(`Error al borrar Provincia: ${err.message}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(buscar: any):void {    
    this.searchText = buscar.nombre_provincia;
    this.searchId = buscar.codigo;
    this.getTipoProvincia();
  }
}
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Provincia } from 'src/app/core/models/provincia';
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditProvinciaDialogComponent } from '../edit-provincia-dialog/add-edit-provincia-dialog.component'; 

@Component({
  selector: 'app-provincia-dashboard',
  templateUrl: './provincia-dashboard.component.html',
  styleUrls: ['./provincia-dashboard.component.scss']
})
export class ProvinciaDashboardComponent {

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

  public dataSource: MatTableDataSource<Provincia>;
  public searchText: string;
  public provincia: Provincia[] = [];

  constructor(private provinciaService: ProvinciaService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getProvincia(): void {
    this.utils.openLoading();
    let body = JSON.stringify({nombre_provincia: this.searchText});
    this.provinciaService.getProvinciaByDesc(body).subscribe({
      next:(res:any) => {
        this.provincia = res.dataset as Provincia[];
        this.dataSource = new MatTableDataSource<Provincia>(this.provincia);
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

  public editProvincia(tipoProvincia: Provincia): void {
    const modalNuevaProvincia = this.dialog.open(AddEditProvinciaDialogComponent, {
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

    modalNuevaProvincia.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.provinciaService.editProvincia(res).subscribe({
            next: () => {
              this.utils.notification("La Provincia se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editProvincia(res)
            },
            complete: () => {
              this.searchText = res.nombre_provincia.trim();
              this.utils.closeLoading();
              setTimeout(() => {
                this.getProvincia();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewProvincia(tipoProvincia: Provincia): void {
    this.dialog.open(AddEditProvinciaDialogComponent, {
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

  public filter(data: string):void {    
    this.searchText = data;
    this.getProvincia();
  }
}
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { CondicionIva } from 'src/app/core/models/condicion-iva.interface';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditCondicionIvaDialogComponent } from '../add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaService } from 'src/app/core/services/condicion-iva.service';

@Component({
  selector: 'app-condicion-iva-dashboard',
  templateUrl: './condicion-iva-dashboard.component.html',
  styleUrls: ['./condicion-iva-dashboard.component.scss']
})
export class CondicionIvaDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_de_IVA',
    'descripcion',
    'descripcion_reducida',
    'formulario_AB',
    'actions'
  ];

  public dataSource: MatTableDataSource<CondicionIva>;

  public searchValue: string;

  public documents: CondicionIva[] = [];

  constructor(private tipoCondicionService: CondicionIvaService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getCondicionIva(): void {
    this.utils.openLoading();
    this.tipoCondicionService.getCondicionIvaCRUD(this.searchValue).subscribe({
      next:(res:any) => {
        this.documents = res.dataset as CondicionIva[];
        this.dataSource = new MatTableDataSource<CondicionIva>(this.documents);
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

  public editCondicionIVA(tipoCondicion: CondicionIva): void {
    const modalNuevaCondicionIva = this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `Editar Condicion IVA`,
        par_modo: "U",
        codigo_de_IVA: tipoCondicion.codigo_de_IVA,
        descripcion: tipoCondicion.descripcion,
        descripcion_reducida: tipoCondicion.descripcion_reducida,
        formulario_AB: tipoCondicion.formulario_AB,
        edit: true
      }
    });

    modalNuevaCondicionIva.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.tipoCondicionService.getCondicionIvaCRUD(res).subscribe({
            next: () => {
              this.utils.notification("La Condicion IVA se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editCondicionIVA(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: "G",
                  descripcion: res.descripcion
                })

                this.getCondicionIva();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewCondicionIVA(tipoCondicion: CondicionIva): void {
    this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `Ver Condicion IVA`,
        par_modo: "G",
        codigo_de_IVA: tipoCondicion.codigo_de_IVA,
        descripcion: tipoCondicion.descripcion,
        descripcion_reducida: tipoCondicion.descripcion_reducida,
        formulario_AB: tipoCondicion.formulario_AB,
        edit: false
      }
    });
  }

  public filter(buscar: string):void {
    this.searchValue = buscar;
      this.getCondicionIva()
  }

}
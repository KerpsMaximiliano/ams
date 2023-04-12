import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { CondicionIva } from 'src/app/core/models/tipo-condicion-iva.interface';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditCondicionIvaDialogComponent } from '../add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaService } from 'src/app/core/services/tipo-condicion-iva.service';

@Component({
  selector: 'app-condicion-iva-dashboard',
  templateUrl: './tipo-condicion-iva-dashboard.component.html',
  styleUrls: ['./tipo-condicion-iva-dashboard.component.scss']
})
export class CondicionIvaDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'tipo-documento',
    'codigo',
    'abreviatura',
    'formulario',
    'actions'
  ];

  public dataSource: MatTableDataSource<CondicionIva>;

  public searchText: string = "";

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
    let aux = {
      descripcion: this.searchText
    }
    let body = JSON.stringify(aux)
    this.tipoCondicionService.getDocumentByDesc(body).subscribe({
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

  public editDocType(tipoCondicion: CondicionIva): void {
    const modalNuevaCondicionIva = this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `Editar Documento`,
        id: tipoCondicion.id,
        tipo: tipoCondicion.descripcion,
        abreviatura: tipoCondicion.codigo,
        formulario: tipoCondicion.formulario,
        tipo_documento: tipoCondicion.tipo_de_documento,
        edit: true
      }
    });

    modalNuevaCondicionIva.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.tipoCondicionService.editDocument(res).subscribe({
            next: () => {
              this.utils.notification("El Documento se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editDocType(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getCondicionIva();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewDocType(tipoCondicion: CondicionIva): void {
    this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `Ver Documento`,
        id: tipoCondicion.id,
        tipo: tipoCondicion.descripcion,
        abreviatura: tipoCondicion.codigo,
        formulario: tipoCondicion.formulario,
        edit: false
      }
    });
  }


  public deleteDocType(tipoDoc: CondicionIva): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Documento`,
        message: `¿Está seguro de eliminar el documento ${tipoDoc.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.tipoCondicionService.deleteParametro(res.id).subscribe({
            next: (res: any) => {
              this.utils.notification("El Documento se ha borrado exitosamente", 'success')
              this.getCondicionIva();
            },
            error: (err) => {
              (err.status == 0)
              ? this.utils.notification('Error de conexion', 'error') 
              : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')            }
          });
        }
      }
    })
  }

  public filter(text: any):void {
    this.searchText = text;
    (this.searchText != "")
      ? this.getCondicionIva()
      : this.dataSource.data = [] 
  }
}
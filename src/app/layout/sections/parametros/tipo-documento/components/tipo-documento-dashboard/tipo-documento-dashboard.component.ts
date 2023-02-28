import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { TipoDocumento } from 'src/app/core/models/tipo-documento';
import { ParametrosService } from 'src/app/core/services/parametros.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditTipoDocumentoDialogComponent } from '../add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';

@Component({
  selector: 'app-tipo-documento-dashboard',
  templateUrl: './tipo-documento-dashboard.component.html',
  styleUrls: ['./tipo-documento-dashboard.component.scss']
})
export class TipoDocumentoDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'tipo-documento',
    'abreviatura',
    'control-cuit',
    'actions'
  ];

  public dataSource: MatTableDataSource<TipoDocumento>;

  public searchText: string = "";

  public states: TipoDocumento[] = [];

  constructor(private parametrosService: ParametrosService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getTipoDocumento(): void {
    this.utils.openLoading();
    let aux = {
      descripcion: this.searchText
    }
    let body = JSON.stringify(aux)
    this.parametrosService.getParamByDesc(body).subscribe({
      next:(res:any) => {
        console.log (res)
        this.states = res as TipoDocumento[];
        this.dataSource = new MatTableDataSource<TipoDocumento>(this.states);
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
        this.utils.notification(`Error al obtener parametros: ${err.message}`, 'error')
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

  public editDocType(tipoDocumento: TipoDocumento): void {
    const modalNuevoTipoDocumento = this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: `Editar Documento`,
        id: tipoDocumento.id,
        tipo: tipoDocumento.descripcion,
        abreviatura: tipoDocumento.descripcion_reducida,
        cuit: tipoDocumento.control_cuit,
        tipo_documento: tipoDocumento.tipo_de_documento,
        edit: true
      }
    });

    modalNuevoTipoDocumento.afterClosed().subscribe({
      next:(res) => {
        this.utils.openLoading();
        this.parametrosService.editParametro(res).subscribe({
          next: () => {
            this.utils.notification("El Documento se ha editado extiosamente", 'success')
          },
          error: (err) => {
            this.utils.closeLoading();
            this.utils.notification(`Error al editar el Documento: ${err.error.message}`, 'error')
          },
          complete: () => {
            this.utils.closeLoading();
            setTimeout(() => {
              this.getTipoDocumento();
            }, 300);
          }
        });
      }
    });
  }

  public viewDocType(tipoDocumento: TipoDocumento): void {
    this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: `Ver Documento`,
        id: tipoDocumento.id,
        tipo: tipoDocumento.descripcion,
        abreviatura: tipoDocumento.descripcion_reducida,
        cuit: tipoDocumento.control_cuit,
        edit: false
      }
    });
  }


  public deleteDocType(tipoDoc: TipoDocumento): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Documento`,
        message: `¿Está seguro de eliminar el documento ${tipoDoc.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.parametrosService.deleteParametro(tipoDoc.id).subscribe({
            next: (res: any) => {
              this.utils.notification("El Documento se ha borrado exitosamente", 'success')
              this.getTipoDocumento();
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
      ? this.getTipoDocumento()
      : this.dataSource.data = [] 
  }
}
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ObraSocial } from 'src/app/core/models/obra-social.interface';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditObraSocialDialogComponent } from '../add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';

@Component({
  selector: 'app-obra-social-dashboard',
  templateUrl: './obra-social-dashboard.component.html',
  styleUrls: ['./obra-social-dashboard.component.scss']
})
export class ObraSocialDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'obra-social',
    'codigo',
    'tipo',
    'formulario',
    'actions'
  ];

  public dataSource: MatTableDataSource<ObraSocial>;

  public searchText: string = "";

  public documents: ObraSocial[] = [];

  constructor(private obraSocialService: ObraSocialService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getobraSocial(): void {
    this.utils.openLoading();
    let aux = {
      descripcion: this.searchText
    }
    let body = JSON.stringify(aux)
    this.obraSocialService.getDocumentByDesc(body).subscribe({
      next: (res: any) => {
        this.documents = res.dataset as ObraSocial[];
        this.dataSource = new MatTableDataSource<ObraSocial>(this.documents);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " + (this.paginator.pageIndex + 1) + " de " + this.paginator.length
          }
        }, 100)
      },
      error: (err: any) => {
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

  public editDocType(obraSocial: ObraSocial): void {
    const modalNuevoObraSocial = this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: `Editar Documento`,
        id: obraSocial.id,
        tipo: obraSocial.descripcion,
        formulario: obraSocial.formulario,
        tipo_documento: obraSocial.tipo_de_documento,
        edit: true
      }
    });

    modalNuevoObraSocial.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.obraSocialService.editDocument(res).subscribe({
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
                this.getobraSocial();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewDocType(obraSocial: ObraSocial): void {
    this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: `Ver Documento`,
        id: obraSocial.id,
        tipo: obraSocial.descripcion,
        formulario: obraSocial.formulario,
        edit: false
      }
    });
  }


  public deleteDocType(tipoDoc: ObraSocial): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Documento`,
        message: `¿Está seguro de eliminar el documento ${tipoDoc.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.obraSocialService.deleteParametro(res.id).subscribe({
            next: (res: any) => {
              this.utils.notification("El Documento se ha borrado exitosamente", 'success')
              this.getobraSocial();
            },
            error: (err) => {
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(text: any): void {
    this.searchText = text;
    (this.searchText != "")
      ? this.getobraSocial()
      : this.dataSource.data = []
  }
}
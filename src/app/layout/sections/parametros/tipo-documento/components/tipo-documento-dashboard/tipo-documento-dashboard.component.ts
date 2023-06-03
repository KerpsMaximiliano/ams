import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { TipoDocumentoService } from 'src/app/core/services/tipo-documento.service';

// * Interfaces
import { ITipoDocumento } from 'src/app/core/models/tipo-documento.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditTipoDocumentoDialogComponent } from '../add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';

@Component({
  selector: 'app-tipo-documento-dashboard',
  templateUrl: './tipo-documento-dashboard.component.html',
  styleUrls: ['./tipo-documento-dashboard.component.scss'],
})
export class TipoDocumentoDashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);

  @ViewChild(MatTable) table!: MatTable<any>;

  public searchEvent: string = '';
  public searchId: number = 0; // VERIFICAR.
  public documents: ITipoDocumento[] = [];
  public displayedColumns: string[] = [
    'id',
    'tipo-documento',
    'abreviatura',
    'control-cuit',
    'actions',
  ];
  public dataSource: MatTableDataSource<ITipoDocumento>;

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Ultima página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? 'Página ' + (page + 1) + ' de ' + Math.ceil(length / pageSize)
        : 'Página 0 de 0';
    };
  }

  private getTipoDocumento(): void {
    this.utils.openLoading();
    let aux = {
      par_modo: 'C',
      descripcion: this.searchEvent,
      id: this.searchId,
    };
    let body = JSON.stringify(aux);
    this.tipoDocumentoService.CRUD(body).subscribe({
      next: (res: any) => {
        this.documents = res.dataset as ITipoDocumento[];
        this.dataSource = new MatTableDataSource<ITipoDocumento>(
          this.documents
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
      },
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editTipoDocumento(tipoDocumento: ITipoDocumento): void {
    const modalNuevoTipoDocumento = this.dialog.open(
      AddEditTipoDocumentoDialogComponent,
      {
        data: {
          title: `EDITAR COUMENTO`,
          edit: true,
          id: tipoDocumento.tipo_de_documento,
          tipo: tipoDocumento.descripcion,
          abreviatura: tipoDocumento.descripcion_reducida,
          cuit: tipoDocumento.control_cuit,
          tipo_documento: tipoDocumento.tipo_de_documento,
        },
      }
    );

    modalNuevoTipoDocumento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.tipoDocumentoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Documento se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.editTipoDocumento(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getTipoDocumento();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewTipoDocumento(tipoDocumento: ITipoDocumento): void {
    this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: `VER DOCUMENTO`,
        edit: false,
        id: tipoDocumento.id,
        tipo: tipoDocumento.descripcion,
        abreviatura: tipoDocumento.descripcion_reducida,
        cuit: tipoDocumento.control_cuit,
      },
    });
  }

  public filter(buscar: any): void {
    this.searchId = buscar.id;
    this.searchEvent = buscar.descripcion;
    this.getTipoDocumento();
  }
}

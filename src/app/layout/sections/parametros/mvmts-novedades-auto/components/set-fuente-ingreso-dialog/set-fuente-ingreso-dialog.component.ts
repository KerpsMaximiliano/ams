import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-fuente-ingreso-dialog',
  templateUrl: './set-fuente-ingreso-dialog.component.html',
  styleUrls: ['./set-fuente-ingreso-dialog.component.scss'],
})
export class FuenteIngresoSetDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  public displayedColumns: string[] = [
    'codigo_fuente_ingreso',
    'descripcion',
    'actions',
  ];
  public dataSource: MatTableDataSource<IFuenteIngreso>;
  public fuentesIngreso: IFuenteIngreso[];
  public showGuardarButton: any;

  constructor(
    private fuenteIngresoService: FuenteIngresoService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.getFuenteIngreso();
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  public confirm(): void {
    this.dialogRef.close({
      codigo_fuente_ingreso: this.showGuardarButton.codigo_fuente_ingreso,
      descripcion: this.showGuardarButton.descripcion ? this.showGuardarButton.descripcion.trim() : '',
    });
  }

  private getFuenteIngreso(): void {
    this.showGuardarButton = undefined;
    this.utils.openLoading();
    this.fuenteIngresoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          desc_empresa: ''
        })
      )
      .subscribe({
        next: (res: any) => {
          this.fuentesIngreso = Array.isArray(res.dataset)
            ? (res.dataset as IFuenteIngreso[])
            : res.dataset
            ? [res.dataset as IFuenteIngreso]
            : [];
          this.dataSource = new MatTableDataSource<IFuenteIngreso>(this.fuentesIngreso);
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          this.utils.closeLoading();
          if (err.status === 404) {
            this.fuentesIngreso = [];
            this.dataSource = new MatTableDataSource<IFuenteIngreso>(this.fuentesIngreso);
            this.dataSource.paginator = this.paginator;
          } else {
            const errorMessage =
              err.status === 0
                ? 'Error de conexión.'
                : `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`;
            this.utils.notification(errorMessage, 'error');
          }
        },
        complete: () => {
          this.dataSource = new MatTableDataSource<IFuenteIngreso>(this.fuentesIngreso);
          this.dataSource.paginator = this.paginator;
          this.utils.closeLoading();
        },
      });
  }

  private configurePaginator(): void {
    this.paginator._intl = this.matPaginatorIntl;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Última página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? `Página ${page + 1} de ${Math.ceil(length / pageSize)}`
        : 'Página 0 de 0';
    };
  }
}

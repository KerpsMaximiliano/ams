import {
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProductoAdministrador } from 'src/app/core/models/producto-administrador.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-producto-dialog',
  templateUrl: './set-producto-dialog.component.html',
  styleUrls: ['./set-producto-dialog.component.scss'],
})
export class SetProdSubDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  public displayedColumns: string[] = [
    'codigo_producto',
    'descripcion_producto',
    'producto_administrador',
    'descripcion_producto_administrador',
    'actions',
  ];
  public dataSource: MatTableDataSource<IProductoAdministrador>;
  public productos: IProductoAdministrador[];

  public showGuardarButton: any;

  constructor(
    private producto: ProductoService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.getProductos()
  }

  public confirm(): void {
    this.dialogRef.close({
      codigo_producto: this.showGuardarButton.codigo_producto,
      descripcion_producto: this.showGuardarButton.descripcion_producto ? this.showGuardarButton.descripcion_producto.trim() : '',
      producto_administrador: this.showGuardarButton.producto_administrador,
      descripcion_producto_administrador: this.showGuardarButton.descripcion_producto_administrador ? this.showGuardarButton.descripcion_producto_administrador.trim() : '',
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getProductos(): void {
    this.showGuardarButton = null;
    this.utils.openLoading();
    this.producto
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
          codigo_fuente_ingreso: this.data.codigo_fuente_ingreso
        })
      )
      .subscribe({
        next: (res: any) => {
          this.productos = Array.isArray(res.dataset)
            ? (res.dataset as IProductoAdministrador[])
            : res.dataset
            ? [res.dataset as IProductoAdministrador]
            : [];
          this.dataSource = new MatTableDataSource<IProductoAdministrador>(
            this.productos
          );
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          this.utils.closeLoading();
          if (err.status === 404) {
            this.productos = [];
            this.dataSource = new MatTableDataSource<IProductoAdministrador>(
              this.productos
            );
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
          this.dataSource = new MatTableDataSource<IProductoAdministrador>(
            this.productos
          );
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

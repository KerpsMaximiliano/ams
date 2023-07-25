import { Inject, Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

// * Others

@Component({
  selector: 'app-modal-extencion-producto',
  templateUrl: './modal-extencion-producto.component.html',
  styleUrls: ['./modal-extencion-producto.component.scss'],
})
export class ModalExtencionProductoComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  searchValue: string;
  displayedColumns: string[] = ['codigo_producto', 'descripcion', 'actions'];
  productosTabla: IProducto[];
  productos: IProducto[];
  dataSource: MatTableDataSource<IProducto>;
  Producto: IProducto[];
  selectedItem: IProducto;

  constructor(
    public dialogRef: MatDialogRef<any>,
    private productoService: ProductoService,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // * Assign the data to the data source for the table to render
    this.getProductos(this.data.producto_cod);
  }

  // * filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // * guarda el dato seleccionado
  onCheckboxChange(datos: IProducto) {
    this.selectedItem = datos;
  }

  selected() {
    this.dialogRef.close(this.selectedItem);
  }

  // * recupera los datos de fuente de ingreso
  private getProductos(inputprod?: any): void {
    this.utilService.openLoading();

    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'B',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.utilService.closeLoading();
          this.Producto = res.dataset as IProducto[];
          this.dataSource = new MatTableDataSource<IProducto>(this.Producto);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.getRangeLabel = (): string => {
              return (
                'Página ' +
                (this.paginator.pageIndex + 1) +
                ' de ' +
                (Math.floor(this.paginator.length / this.paginator.pageSize) +
                  1)
              );
            };
          }, 100);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}

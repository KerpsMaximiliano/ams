import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Forms
import { UntypedFormControl } from '@angular/forms';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { unificacionAporteService } from 'src/app/core/services/unificacion-aportes.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss'],
})
export class ModalProductoComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  searchValue: string;
  displayedColumns: string[] = [
    'codigo_producto',
    'descripcion',
    'codigo_subproducto',
    'subdescripcion',
    'actions',
  ];
  subproducto = new UntypedFormControl('');
  selectedItem: any = {
    producto_principal: '',
    descripcion_producto_cod: 0,
    subproducto_principal: '',
    subproducto_principal_cod: 0,
  };
  selectedParam: any;
  selection = [];
  allProduct: IProducto[];
  productos: IProducto[];
  dataSource: MatTableDataSource<IProducto>;

  constructor(
    public dialogRef: MatDialogRef<any>,
    private _productos: ProductoService,
    private _liveAnnouncer: LiveAnnouncer,
    private _unificadorAportes: unificacionAporteService,
    private utils: UtilService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productoOption();
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

  // * carga los productos a la lista desplegable
  public productoOption(): void {
    let body = {
      par_modo: 'L',
      descripcion: '',
    };
    this._productos.CRUD(JSON.stringify(body)).subscribe({
      next: (respuesta) => {
        console.log(respuesta);

        this.productos = respuesta.dataset.filter(
          (filtroprod) => filtroprod.tipo_producto == 'P'
        );
      },
      error: (err) => {
        if (err.status == 0)
          this.utils.notification('No se pudo cargar los productos', 'error');
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

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  // * seleccion de producto
  public onCheckboxChange(row: any): void {
    this.selectedParam = row;
    if (this.selection.length < 1) {
      if (row) {
        this.selection = row;
      } else {
        this.selection = [];
      }
    }
    this.selectedItem.producto_principal = this.getproducto(
      row.producto_principal
    );
    this.selectedItem.descripcion_producto_cod = row.producto_principal;
    this.selectedItem.subproducto_principal = this.getproducto(
      row.producto_secundario
    );
    this.selectedItem.subproducto_principal_cod = row.producto_secundario;
  }

  public selected(): void {
    this.dialogRef.close(this.selectedItem);
  }

  public search(inputprod: any): void {
    this.getProductos(inputprod);
  }

  // * traduce el codigo del producto al nombre para mostrar por pantalla
  public getproducto(prod: number): string {
    const producto = this.productos.find(
      (filtro: any) => filtro.codigo_producto === prod
    );
    return producto ? producto.descripcion_producto : '';
  }

  // * tiene los valores de producto de para la tabla
  private getProductos(inputprod: any): void {
    this.utils.openLoading();
    this._unificadorAportes
      .CRUD(
        JSON.stringify({
          par_modo: 'R',
          descripcion: inputprod,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.utils.closeLoading();
          this.allProduct = res.dataset as IProducto[];
          this.dataSource = new MatTableDataSource<IProducto>(this.allProduct);
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
}

export interface Iproduc {
  producto_principal: '';
  descripcion_producto_cod: 0;
  subproducto_principal: '';
  subproducto_principal_cod: 0;
}

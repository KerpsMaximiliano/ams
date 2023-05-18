import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditProductoDialogComponent } from '../add-edit-producto-dialog/add-edit-producto-dialog.component';

@Component({
  selector: 'app-producto-dashboard',
  templateUrl: './producto-dashboard.component.html',
  styleUrls: ['./producto-dashboard.component.scss'],
})
export class ProductoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_estado_civil',
    'description',
    'actions',
  ];

  public dataSource: MatTableDataSource<IProducto>;

  public searchValue: string = '';

  public estadoCivil: IProducto[] = [];

  constructor(
    private productoService: ProductoService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getProducto(): void {
    this.utils.openLoading();
    this.productoService.getProductoCRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.estadoCivil = res.dataset as IProducto[])
          : (this.estadoCivil = [res.dataset]);
        this.dataSource = new MatTableDataSource<IProducto>(this.estadoCivil);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return (
              'Página ' +
              (this.paginator.pageIndex + 1) +
              ' de ' +
              this.paginator.length
            );
          };
        }, 100);
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión.', 'error')
          : this.utils.notification(
              `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
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

  public editProducto(producto: IProducto): void {
    const modalNuevoProducto = this.dialog.open(
      AddEditProductoDialogComponent,
      {
        data: {
          title: `EDITAR PRODUCTO`,
          edit: true,
          par_modo: 'U',
        },
      }
    );

    modalNuevoProducto.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.productoService.getProductoCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Producto se ha editado extiosamente.',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.editProducto(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getProducto();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewProducto(producto: IProducto): void {
    this.dialog.open(AddEditProductoDialogComponent, {
      data: {
        title: `VER PRODUCTO`,
        edit: false,
        par_modo: 'C',
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getProducto();
  }
}

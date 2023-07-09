import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-atributos-relacion-capita-plan-set-producto-dialog',
  templateUrl:
    './atributos-relacion-capita-plan-set-producto-dialog.component.html',
  styleUrls: [
    './atributos-relacion-capita-plan-set-producto-dialog.component.scss',
  ],
})
export class AtributosRelacionCapitaPlanSetProductoDialogComponent
  implements OnInit
{
  public displayedColumns: string[] = [
    'codigo_producto',
    'descripcion_producto',
    'actions',
  ];
  public dataSource: MatTableDataSource<IProducto>;
  public producto: any;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data);
  }

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IProducto>(this.data.data);
    this.dataSource.paginator = this.paginator;
  }

  public confirm(): void {
    this.dialogRef.close({
      producto_administrador: this.producto.producto_administrador,
      descripcion_producto_administrador:
        this.producto.descripcion_producto_administrador,
      codigo_producto: this.producto.codigo_producto,
      descripcion_producto: this.producto.descripcion_producto,
    });
  }

  public applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
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

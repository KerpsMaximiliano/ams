import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from '../../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-unificacion-set-producto-dialog',
  templateUrl: './unificacion-set-producto-dialog.component.html',
  styleUrls: ['./unificacion-set-producto-dialog.component.scss'],
})
export class UnificacionSetProductoDialogComponent implements OnInit {
  public displayedColumns: string[] = [
    'producto_principal',
    'producto_principal_descripcion',
    'subproducto_principal',
    'subproducto_principal_descripcion',
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
      producto_secundario: this.producto.producto_principal,
      producto_secundario_descripcion:
        this.producto.producto_principal_descripcion,
      subproducto_secundario: this.producto.subproducto_principal,
      subproducto_secundario_descripcion:
        this.producto.subproducto_principal_descripcion,
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IProductoAdministrador } from 'src/app/core/models/producto-administrador.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-producto-dialog',
  templateUrl: './set-producto-dialog.component.html',
  styleUrls: ['./set-producto-dialog.component.scss'],
})
export class SetProductoDialogComponent implements OnInit {
  public displayedColumns: string[] = [
    'codigo_subproducto',
    'descripcion_subproducto',
    'actions',
  ];
  public dataSource: MatTableDataSource<IProductoAdministrador>;
  public showGuardarButton: any;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IProductoAdministrador>(this.data.data);
    this.dataSource.paginator = this.paginator;
  }

  public confirm(): void {
    this.dialogRef.close({
      codigo_producto: this.showGuardarButton.producto_principal_cod,
      descripcicon_producto:this.showGuardarButton.producto_principal,
      codigo_subproducto: this.showGuardarButton.subproducto_principal_cod,
      descripcion_subproducto: this.showGuardarButton.subproducto_principal,
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

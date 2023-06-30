import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IDialog } from 'src/app/core/models/dialog.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-motivo-movimiento-dialog',
  templateUrl: './set-motivo-movimiento-dialog.component.html',
  styleUrls: ['./set-motivo-movimiento-dialog.component.scss'],
})
export class SetMotivoMovimientoDialogComponent implements OnInit {
  public displayedColumns: string[] = ['codigo', 'descripcion', 'actions'];
  public dataSource: MatTableDataSource<IDialog>;
  public btn_radio: any;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private matPaginatorIntl: MatPaginatorIntl,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IDialog>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  public confirm(): void {
    this.dialogRef.close({
      option: this.data.option,
      codigo: this.btn_radio.codigo,
      descripcion: this.btn_radio.descripcion,
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

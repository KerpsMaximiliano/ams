import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IBanco } from 'src/app/core/models/dato-comercio.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-banco-dialog',
  templateUrl: './set-banco-dialog.component.html',
  styleUrls: ['./set-banco-dialog.component.scss'],
})
export class SetBancoDialogComponent implements OnInit {
  public displayedColumns: string[] = ['codigo', 'descripcion', 'actions'];
  public dataSource: MatTableDataSource<IBanco>;
  public banco: IBanco;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  public page: number = 0;
  public pageSize: number = 6;

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    public dialogRef: MatDialogRef<ConfirmDialogComponent, IBanco>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IBanco>(this.data.data);
    this.dataSource.paginator = this.paginator;

    // Inicializa la posición de la tabla si había un banco seleccionado
    if (this.data.id_banco) {
      this.banco = this.data.data.find(
        (banco: IBanco) => banco.codigo === this.data.id_banco
      );
      const item_number = this.dataSource.data.indexOf(this.banco);
      this.page = Math.floor(item_number / this.pageSize);
    }
  }

  public confirm(): void {
    this.dialogRef.close(this.banco);
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

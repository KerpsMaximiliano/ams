import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Interfaces
import { IEntidad } from 'src/app/core/models/entidad.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tambo-set-entidad-dialog',
  templateUrl: './tambo-set-entidad-dialog.component.html',
  styleUrls: ['./tambo-set-entidad-dialog.component.scss'],
})
export class TamboSetEntidadDialogComponent implements OnInit {
  public displayedColumns: string[] = [
    'canal',
    'nro_asesor',
    'tambo',
    'actions',
  ];
  public dataSource: MatTableDataSource<IEntidad>;
  public entidad: IEntidad;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
    this.dataSource = new MatTableDataSource<IEntidad>(this.data.data);
    this.dataSource.paginator = this.paginator;
  }

  public confirm(): void {
    this.dialogRef.close({
      nro_asesor: this.entidad?.nro_asesor ? this.entidad?.nro_asesor : 0,
      canal: this.entidad?.canal ? this.entidad?.canal : 0,
      tipo_asesor: this.entidad?.tipo_asesor ? this.entidad?.tipo_asesor : '',
      id_empresa_persona: this.entidad?.id_empresa_persona
        ? this.entidad?.id_empresa_persona
        : 0,
      desc_empresa: this.entidad?.desc_empresa
        ? this.entidad?.desc_empresa
        : '',
      nombre_per: this.entidad?.nombre_per ? this.entidad?.nombre_per : '',
      apellido_Per: this.entidad?.apellido_Per
        ? this.entidad?.apellido_Per
        : '',
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

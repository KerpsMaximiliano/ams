import { Component, Inject, OnInit, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { MvmtsNovedadesAutoService } from 'src/app/core/services/mvmts-novedades-auto.service';

// * Interfaces
import { IPlan } from 'src/app/core/models/mvmts-novedades-auto.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-set-plan-dialog',
  templateUrl: './set-plan-dialog.component.html',
  styleUrls: ['./set-plan-dialog.component.scss'],
})
export class SetPlanDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  public displayedColumns: string[] = [
    'codigo_producto',
    'plan',
    'descripcion',
    'actions',
  ];

  public dataSource: MatTableDataSource<IPlan>;
  public plan: IPlan[];
  public showGuardarButton: any;

  constructor(
    private mvmtsAutoService: MvmtsNovedadesAutoService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getPlanes()
    this.configurePaginator();
  }

  public confirm(): void {
    this.dialogRef.close({
      plan: this.showGuardarButton.plan,
      descripcion: this.showGuardarButton.descripcion,
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getPlanes(): void {
    this.utils.openLoading();
    this.mvmtsAutoService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
          producto_origen: this.data.codigo_producto,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.plan = Array.isArray(res.dataset)
            ? (res.dataset as IPlan[])
            : res.dataset
              ? [res.dataset as IPlan]
              : [];
          this.dataSource = new MatTableDataSource<IPlan>(this.plan);
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          this.utils.closeLoading();
          if (err.status === 404) {
            this.plan = [];
            this.dataSource = new MatTableDataSource<IPlan>(this.plan);
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
          this.dataSource = new MatTableDataSource<IPlan>(this.plan);
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

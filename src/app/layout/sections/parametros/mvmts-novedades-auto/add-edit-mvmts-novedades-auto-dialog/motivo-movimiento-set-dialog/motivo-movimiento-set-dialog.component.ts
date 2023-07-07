import {
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';

// * Interfaces
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

// * Components
import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-motivo-movimiento-set-dialog',
  templateUrl: './motivo-movimiento-set-dialog.component.html',
  styleUrls: ['./motivo-movimiento-set-dialog.component.scss'],
})
export class MotivMovimientoSetDialogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;
  @ViewChild('selectMovimiento') selectMovimiento: any;
  public displayedColumns = [
    'id_motivo',
    'descripcion',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMotivoMovimiento>;
  public movimientos: IMotivoMovimiento[];
  public showGuardarButton: any;

  constructor(
    private movimientoService: MotivoMovimientoService,
    private matPaginatorIntl: MatPaginatorIntl,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  public getMovimientos(value: string): void {
    this.showGuardarButton = null;
    this.utils.openLoading();
    this.movimientoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          tipo_motivo: this.selectMovimiento.value,
          descripcion: value
        })
      )
      .subscribe({
        next: (res: any) => {
          this.movimientos = Array.isArray(res.dataset)
            ? (res.dataset as IMotivoMovimiento[])
            : res.dataset
            ? [res.dataset as IMotivoMovimiento]
            : [];
          this.dataSource = new MatTableDataSource<IMotivoMovimiento>(
            this.movimientos
          );
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          this.utils.closeLoading();
          if (err.status === 404) {
            this.movimientos = [];
            this.dataSource = new MatTableDataSource<IMotivoMovimiento>(
              this.movimientos
            );
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
          this.dataSource = new MatTableDataSource<IMotivoMovimiento>(
            this.movimientos
          );
          this.dataSource.paginator = this.paginator;
          this.utils.closeLoading();
        },
      });
  }

  public confirm(): void {
    this.dialogRef.close({
      id_motivo: this.showGuardarButton.id_motivo,
      descripcion: this.showGuardarButton.descripcion,
    });
  }

  public clear(input: HTMLInputElement) {
    input.value = '';
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

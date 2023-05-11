import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FormasPagoService } from 'src/app/core/services/formas-pago.service';

// * Interfaces
import { IFormasPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditFormasPagoDialogComponent } from '../add-edit-formas-pago-dialog/add-edit-formas-pago-dialog.component';

@Component({
  selector: 'app-formas-pago-dashboard',
  templateUrl: './formas-pago-dashboard.component.html',
  styleUrls: ['./formas-pago-dashboard.component.scss'],
})
export class FormasPagoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = ['actions']; // COMPLETAR

  public dataSource: MatTableDataSource<IFormasPago>;

  public searchValue: string = '';

  public formasPago: IFormasPago[] = [];

  constructor(
    private formasPagoService: FormasPagoService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getFormasPago(): void {
    this.utils.openLoading();
    this.formasPagoService.getFormasPagoCRUD(this.searchValue).subscribe({
      next: (res: any) => {
        (res.dataset.length)
          ? this.formasPago = res.dataset as IFormasPago[]
          : this.formasPago = [res.dataset];
        this.dataSource = new MatTableDataSource<IFormasPago>(this.formasPago);
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

  public editFormaPago(formaPago: IFormasPago): void {
    const modalEditFormaPago = this.dialog.open(
      AddEditFormasPagoDialogComponent,
      {
        data: {
          title: `EDITAR FORMA DE PAGO`,
          edit: true,
          // COMPLETAR
        },
      }
    );

    modalEditFormaPago.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.formasPagoService.getFormasPagoCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Forma de Pago se ha editado extiosamente',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.editFormaPago(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getFormasPago();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewFormaPago(formaPago: IFormasPago): void {
    this.dialog.open(AddEditFormasPagoDialogComponent, {
      data: {
        title: `VER FORMA DE PAGO`,
        edit: false,
        par_modo: 'C',
        // COMPLETAR
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getFormasPago();
  }
}

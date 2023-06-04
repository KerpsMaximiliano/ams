import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';

// * Interfaces
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditFormaPagoDialogComponent } from '../add-edit-forma-pago-dialog/add-edit-forma-pago-dialog.component';

@Component({
  selector: 'app-forma-pago-dashboard',
  templateUrl: './forma-pago-dashboard.component.html',
  styleUrls: ['./forma-pago-dashboard.component.scss'],
})
export class FormaPagoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchValue: string = '';
  public formasPago: IFormaPago[] = [];
  public displayedColumns: string[] = [
    'codigo',
    'forma_pago',
    'description',
    'nombre_tarjeta_nemot',
    'codigo_banco',
    'codigo_tarjeta_de_baja',
    'actions',
  ];
  public dataSource: MatTableDataSource<IFormaPago>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private formaPagoService: FormaPagoService
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Ultima página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? 'Página ' + (page + 1) + ' de ' + Math.ceil(length / pageSize)
        : 'Página 0 de 0';
    };
  }

  private getFormaPago(): void {
    this.utils.openLoading();
    this.formaPagoService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.formasPago = res.dataset as IFormaPago[])
          : (this.formasPago = [res.dataset]);
        this.dataSource = new MatTableDataSource<IFormaPago>(this.formasPago);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
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

  public editFormaPago(formaPago: IFormaPago): void {
    const modalEditFormaPago = this.dialog.open(
      AddEditFormaPagoDialogComponent,
      {
        data: {
          title: `EDITAR FORMA DE PAGO`,
          edit: true,
          par_modo: 'U',
          forma_pago: formaPago.forma_pago,
          codigo: formaPago.codigo,
          description: formaPago.description,
          solicita_datos_ad: formaPago.solicita_datos_ad,
          codigo_banco: formaPago.codigo_banco,
          trabaja_archivos: formaPago.trabaja_archivos,
          trabaja_rechazos: formaPago.trabaja_rechazos,
          nombre_tarjeta_nemot: formaPago.nombre_tarjeta_nemot,
          codigo_tarjeta_de_baja: formaPago.codigo_tarjeta_de_baja,
        },
      }
    );

    modalEditFormaPago.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.formaPagoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La forma de pago se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}. `,
                    'error'
                  );
              this.editFormaPago(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getFormaPago();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewFormaPago(formaPago: IFormaPago): void {
    this.dialog.open(AddEditFormaPagoDialogComponent, {
      data: {
        title: `VER FORMA DE PAGO`,
        edit: false,
        par_modo: 'C',
        forma_pago: formaPago.forma_pago,
        codigo: formaPago.codigo,
        description: formaPago.description,
        solicita_datos_ad: formaPago.solicita_datos_ad,
        codigo_banco: formaPago.codigo_banco,
        trabaja_archivos: formaPago.trabaja_archivos,
        trabaja_rechazos: formaPago.trabaja_rechazos,
        nombre_tarjeta_nemot: formaPago.nombre_tarjeta_nemot,
        codigo_tarjeta_de_baja: formaPago.codigo_tarjeta_de_baja,
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getFormaPago();
  }

  public getFormaPagoDescripcion(formaPago: string): string {
    switch (formaPago) {
      case 'BSF':
        return 'Débitos Automáticos';
      case 'LNK':
        return 'Pagos RED LINK';
      case 'CBU':
        return 'Transferencia Bancaria';
      case 'TC ':
        return 'Tarjeta Crédito';
      default:
        return '';
    }
  }
}

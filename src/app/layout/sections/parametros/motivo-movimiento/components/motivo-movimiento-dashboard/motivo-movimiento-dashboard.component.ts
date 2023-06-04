import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';

// * Interfaces
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Componentes
import { AddEditMotivoMovimientoDialogComponent } from '../add-edit-motivo-movimiento-dialog/add-edit-motivo-movimiento-dialog.component';

@Component({
  selector: 'app-motivo-movimiento-dashboard',
  templateUrl: './motivo-movimiento-dashboard.component.html',
  styleUrls: ['./motivo-movimiento-dashboard.component.scss'],
})
export class MotivoMovimientoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchValue: string = '';
  public documents: IMotivoMovimiento[] = [];
  public displayedColumns: string[] = [
    'id_motivo',
    'descripcion',
    'tipo_motivo',
    'datos_adic_SN',
    'fecha_inicio_vigencia',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<IMotivoMovimiento>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private motivoMovimientoService: MotivoMovimientoService
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

  private getMotivoMovimiento(): void {
    this.utils.openLoading();
    this.motivoMovimientoService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        this.documents = res.dataset as IMotivoMovimiento[];
        this.dataSource = new MatTableDataSource<IMotivoMovimiento>(
          this.documents
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
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

  public editMotivo(motivoMovimiento: IMotivoMovimiento): void {
    const modalNuevoMotivoMovimiento = this.dialog.open(
      AddEditMotivoMovimientoDialogComponent,
      {
        data: {
          title: `EDITAR MOTIVO DE MOVIMIENTO`,
          edit: true,
          par_modo: 'U',
          id_motivo: motivoMovimiento.id_motivo,
          tipo_motivo: motivoMovimiento.tipo_motivo,
          descripcion: motivoMovimiento.descripcion,
          datos_adic_SN: motivoMovimiento.datos_adic_SN,
          fecha_inicio_vigencia: motivoMovimiento.fecha_inicio_vigencia,
          fecha_fin_vigencia: motivoMovimiento.fecha_fin_vigencia,
        },
      }
    );
    modalNuevoMotivoMovimiento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.motivoMovimientoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El motivo de movimiento se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.editMotivo(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'C',
                  tipo_motivo: res.tipo_motivo[0],
                  descripcion: res.descripcion,
                });
                this.getMotivoMovimiento();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewMotivo(motivoMovimiento: IMotivoMovimiento): void {
    this.dialog.open(AddEditMotivoMovimientoDialogComponent, {
      data: {
        title: `VER MOTIVO DE MOVIMIENTO`,
        edit: false,
        par_modo: 'C',
        id_motivo: motivoMovimiento.id_motivo,
        tipo_motivo: motivoMovimiento.tipo_motivo,
        descripcion: motivoMovimiento.descripcion,
        datos_adic_SN: motivoMovimiento.datos_adic_SN,
        fecha_inicio_vigencia: motivoMovimiento.fecha_inicio_vigencia,
        fecha_fin_vigencia: motivoMovimiento.fecha_fin_vigencia,
      },
    });
  }

  calcularValor(valor: string): string {
    switch (valor) {
      case 'B':
        return 'B-BAJA';
      case 'A':
        return 'A-ALTA';
      case 'S':
        return 'S-SUSPENSIÓN';
      case 'O':
        return 'O-OSP';
      default:
        return 'S/N';
    }
  }

  calcularFecha(fecha: number) {
    const newFecha = fecha.toString();
    if (fecha != null) {
      return (
        newFecha.slice(6, 8) +
        '/' +
        newFecha.slice(4, 6) +
        '/' +
        newFecha.slice(0, 4)
      );
    } else {
      return null;
    }
  }

  public filter(buscar: string): void {
    this.searchValue = buscar;
    this.getMotivoMovimiento();
  }
}

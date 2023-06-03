import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { IPosicion } from 'src/app/core/models/posicion.interface';
import { PosicionesService } from 'src/app/core/services/abm-posiciones.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { AddEditAbmPosicionesComponent } from '../add-edit-abm-posiciones/add-edit-abm-posiciones.component';

@Component({
  selector: 'app-abm-posiciones-dashboard',
  templateUrl: './abm-posiciones-dashboard.component.html',
  styleUrls: ['./abm-posiciones-dashboard.component.scss'],
})
export class AbmPosicionesDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;
  fecha_hoy: Date = new Date();

  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    // 'letra_provincia',
    'domicilio',
    'estados',
    'actions',
  ];

  public dataSource: MatTableDataSource<IPosicion>;
  public searchText: string = '';
  public searchId: number = 0;
  public Posicion: IPosicion[] = [];

  constructor(
    private posicionesService: PosicionesService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getPosicion(): void {
    this.utils.openLoading();
    let aux = {
      par_modo: 'C',
      descripcion: this.searchText,
      letra_provincia: this.searchId,
    };
    let body = JSON.stringify(aux);
    this.posicionesService.getCRUD(body).subscribe({
      next: (res: any) => {
        console.log(res);

        this.Posicion = res.dataset as IPosicion[];
        this.dataSource = new MatTableDataSource<IPosicion>(this.Posicion);
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
          ? this.utils.notification('Error de conexion', 'error')
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

  public editPosicionType(posiciones: IPosicion): void {
    const modalPosicion = this.dialog.open(AddEditAbmPosicionesComponent, {
      data: {
        title: `Editar Posicion`,
        par_modo: 'U',
        codigo_posicion: posiciones?.codigo_posicion,
        descripcion: posiciones?.descripcion,
        domicilio: posiciones?.domicilio,
        codigo_postal: posiciones?.codigo_postal,
        sub_codigo_postal: posiciones?.sub_codigo_postal,
        control_rechazo: posiciones?.control_rechazo,
        yes_no: posiciones?.yes_no,
        fecha_vigencia: posiciones?.fecha_vigencia,
        letra_provincia: this.searchId,
        edit: true,
      },
    });
    modalPosicion.afterClosed().subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          console.log(res);
          this.utils.openLoading();
          this.posicionesService.getCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Documento se ha editado extiosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.editPosicionType(res);
              console.log(err.error.returnset.Mensaje);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getPosicion();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewDocType(posiciones: IPosicion): void {
    console.log('ver', posiciones);

    this.dialog.open(AddEditAbmPosicionesComponent, {
      data: {
        title: `Ver Documento`,
        codigo_posicion: posiciones?.codigo_posicion,
        descripcion: posiciones?.descripcion,
        domicilio: posiciones?.domicilio,
        codigo_postal: posiciones?.codigo_postal,
        sub_codigo_postal: posiciones?.sub_codigo_postal,
        control_rechazo: posiciones?.control_rechazo,
        yes_no: posiciones?.yes_no,
        fecha_vigencia: posiciones?.fecha_vigencia,
        edit: false,
      },
    });
  }

  public deletePosType(pos: IPosicion): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Documento`,
        message: `¿Está seguro de eliminar el documento ${pos.descripcion}?`,
      },
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.posicionesService.getCRUD(res.id).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'El Documento se ha borrado exitosamente',
                'success'
              );
              this.getPosicion();
            },
            error: (err) => {
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
            },
          });
        }
      },
    });
  }

  public filter(buscar: any): void {
    this.searchText = buscar.descripcion;
    this.searchId = buscar.letra_provincia;
    this.searchText != '' || this.searchId != 0
      ? this.getPosicion()
      : (this.dataSource.data = []);
  }
}

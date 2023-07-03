import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
// * Services
import { UtilService } from 'src/app/core/services/util.service';
// * Interfaces
import { IExtencionFuenteIngreso } from 'src/app/core/models/extencion-fuente-ingreso.interface';
// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
// * Components
import { AddEditExtencionFuenteIngresoComponent } from '../add-edit-extencion-fuente-ingreso/add-edit-extencion-fuente-ingreso.component';
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';
// * Others
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
@Component({
  selector: 'app-extencion-fuente-ingreso-dashboard',
  templateUrl: './extencion-fuente-ingreso-dashboard.component.html',
  styleUrls: ['./extencion-fuente-ingreso-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ExtencionFuenteIngresoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);

  public searchValue: any;
  public fuenteingreso: IExtencionFuenteIngreso[] = [];
  public columnsToDisplay: string[] = ['monto_desde', 'monto_hasta'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions'];

  public dataSource: MatTableDataSource<IExtencionFuenteIngreso>;
  expandedElement: any | null;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private _extencionFuenteIngreso: ExtencionFuenteIngresoService
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

  private getExtencionFuenteIngraso(): void {
    this.utils.openLoading();
    this._extencionFuenteIngreso
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
          codigo_fuente_ingreso: this.searchValue.codigo_fuente_ingreso,
          producto: this.searchValue.producto,
          fecha_de_vigencia: this.searchValue.fecha_de_vigencia,
        })
      )
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.fuenteingreso = res.dataset as IExtencionFuenteIngreso[])
            : (this.fuenteingreso = [res.dataset]);
          this.dataSource = new MatTableDataSource<IExtencionFuenteIngreso>(
            this.fuenteingreso
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

  public editExtencionFuenteIngraso(
    fuenteingreso: IExtencionFuenteIngreso
  ): void {
    const modalNuevaExtencionFuenteIngreso = this.dialog.open(
      AddEditExtencionFuenteIngresoComponent,
      {
        data: {
          title: `EDITAR FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'U',
          codigo_fuente_ingreso: fuenteingreso?.codigo_fuente_ingreso,
          fuente_ingreso: this.searchValue.fuente_ingreso,
          producto: fuenteingreso?.producto,
          producto_des: this.searchValue.producto_des,
          fecha_de_vigencia: fuenteingreso?.fecha_de_vigencia,
          remuneracion_desde: fuenteingreso?.remuneracion_desde,
          remuneracion_hasta: fuenteingreso?.remuneracion_hasta,
          coeficiente_uno: fuenteingreso?.coeficiente_uno,
          coeficiente_dos: fuenteingreso?.coeficiente_dos,
          coeficiente_tres: fuenteingreso?.coeficiente_tres,
          coeficiente_cuatro: fuenteingreso?.coeficiente_cuatro,
          coeficiente_cinco: fuenteingreso?.coeficiente_cinco,
        },
      }
    );

    modalNuevaExtencionFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this._extencionFuenteIngreso.CRUD(res.datos).subscribe({
            next: () => {
              this.utils.notification(
                'La extencion de fuente de ingreso se ha editado extiosamente. ',
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
              this.editExtencionFuenteIngraso(res);
            },
            complete: () => {
              this.utils.closeLoading();
              this.getExtencionFuenteIngraso();
            },
          });
        }
      },
    });
  }

  public viewExtencionFuenteIngraso(
    fuenteingreso: IExtencionFuenteIngreso
  ): void {
    this.dialog.open(AddEditExtencionFuenteIngresoComponent, {
      data: {
        title: `VER FUENTE DE INGRESO`,
        edit: false,
        par_modo: 'R',
        codigo_fuente_ingreso: fuenteingreso?.codigo_fuente_ingreso,
        fuente_ingreso: this.searchValue.fuente_ingreso,
        producto: fuenteingreso?.producto,
        producto_des: this.searchValue.producto_des,
        fecha_de_vigencia: fuenteingreso?.fecha_de_vigencia,
        remuneracion_desde: fuenteingreso?.remuneracion_desde,
        remuneracion_hasta: fuenteingreso?.remuneracion_hasta,
        coeficiente_uno: fuenteingreso?.coeficiente_uno,
        coeficiente_dos: fuenteingreso?.coeficiente_dos,
        coeficiente_tres: fuenteingreso?.coeficiente_tres,
        coeficiente_cuatro: fuenteingreso?.coeficiente_cuatro,
        coeficiente_cinco: fuenteingreso?.coeficiente_cinco,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getExtencionFuenteIngraso();
  }
}

import { ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-extencion-fuente-ingreso-dashboard',
  templateUrl: './extencion-fuente-ingreso-dashboard.component.html',
  styleUrls: ['./extencion-fuente-ingreso-dashboard.component.scss']
})

export class ExtencionFuenteIngresoDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  new MatPaginator(new MatPaginatorIntl(), this.cdr);
  
  public searchValue: string = '';
  public fuenteingreso: IExtencionFuenteIngreso[]=[];
  public displayedColumns: string[] = [
    'fecha_vigencia',
    'monto_desde',
    'monto_hasta',
    'actions'
  ]
  displayColumnsAcordion: string[] = [
    'coeficiente1',
    'coeficiente2',
    'coeficiente3',
    'coeficiente4',
    'coeficiente5',
  ];
  public dataSource: MatTableDataSource<IExtencionFuenteIngreso>;
  activeItem: number | null = null;
  rowIndex: number | null = null; 
  index: number | null = null;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private extncionFuenteIngresoService: ExtencionFuenteIngresoService,
  ) {}

  toggleAccordion(rowIndex: number): void {
    if (this.activeItem === rowIndex) {
      this.activeItem = null;
    } else {
      this.activeItem = rowIndex;
    }
  }

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

  // toggleAccordion(rowIndex: number): void {
  //   if (this.activeRowIndex === rowIndex) {
  //     this.activeRowIndex = -1; // Si se hace clic en la fila activa, se cierra el acordeón
  //   } else {
  //     this.activeRowIndex = rowIndex;
  //   }
  // }

  private getExtencionFuenteIngraso(): void {
    // this.utils.openLoading();
    this.fuenteingreso = [this.extncionFuenteIngresoService.getprueba(this.searchValue)]//.subscribe({
      // next: (res: any) => {
      //   res.dataset.length
          // ? (this.fuenteingreso = res.dataset as IExtencionFuenteIngreso[])
          // : (this.fuenteingreso = [res.dataset]);
        this.dataSource = new MatTableDataSource<IExtencionFuenteIngreso>(
          this.fuenteingreso
        );
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      // },
      // error: (err: any) => {
      //   this.utils.closeLoading();
      //   err.status == 0
      //     ? this.utils.notification('Error de conexión. ', 'error')
      //     : this.utils.notification(
      //         `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
      //         'error'
      //       );
      // },
    //   complete: () => {
    //     this.utils.closeLoading();
    //   },
    // });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editExtencionFuenteIngraso(fuenteingreso: IExtencionFuenteIngreso): void {
    const modalNuevoEstadoCivil = this.dialog.open(
      AddEditExtencionFuenteIngresoComponent,
      {
        data: {
          title: `EDITAR FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'U',
          fuenteIngreso: fuenteingreso?.fuenteingreso,
          producto: fuenteingreso?.producto,
          vigencia: fuenteingreso?.vigencia
        },
      }
    );

    modalNuevoEstadoCivil.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.extncionFuenteIngresoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La extencion de fuente de ingreso  se ha editado extiosamente. ',
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
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  codigo_estado_civil: res.codigo_estado_civil,
                });
                this.getExtencionFuenteIngraso();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewExtencionFuenteIngraso(fuenteingreso: IExtencionFuenteIngreso): void {
    this.dialog.open(AddEditExtencionFuenteIngresoComponent, {
      data: {
        title: `VER FUENTE DE INGRESO`,
        edit: false,
        par_modo: 'R',
        fuenteIngreso: fuenteingreso?.fuenteingreso,
        producto: fuenteingreso?.producto,
        vigencia: fuenteingreso?.vigencia
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getExtencionFuenteIngraso();
  }
}
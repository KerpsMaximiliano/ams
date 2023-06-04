import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PreguntaDDJJService } from 'src/app/core/services/pregunta-ddjj.service';

// * Interfaces
import { IPreguntaDDJJ } from 'src/app/core/models/pregunta-ddjj.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditPreguntaDDJJDialogComponent } from '../add-edit-pregunta-ddjj-dialog/add-edit-pregunta-ddjj-dialog.component';

@Component({
  selector: 'app-pregunta-ddjj-dashboard',
  templateUrl: './pregunta-ddjj-dashboard.component.html',
  styleUrls: ['./pregunta-ddjj-dashboard.component.scss'],
})
export class PreguntaDDJJDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchValue: string = '';
  public preguntasDDJJ: IPreguntaDDJJ[] = [];
  public displayedColumns: string[] = [
    'nro_preg',
    'primer_texto_preg',
    'segundo_texto_preg',
    'pide_fecha',
    'yes_no',
    'actions',
  ];
  public dataSource: MatTableDataSource<IPreguntaDDJJ>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private preguntaDDJJService: PreguntaDDJJService
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

  private getPreguntaDDJJ(): void {
    this.utils.openLoading();
    this.preguntaDDJJService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.preguntasDDJJ = res.dataset as IPreguntaDDJJ[])
          : (this.preguntasDDJJ = [res.dataset]);
        this.dataSource = new MatTableDataSource<IPreguntaDDJJ>(
          this.preguntasDDJJ
        );
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

  public editPreguntaDDJJ(preguntaDDJJ: IPreguntaDDJJ): void {
    const modalEditPreguntasDDJJ = this.dialog.open(
      AddEditPreguntaDDJJDialogComponent,
      {
        data: {
          title: `EDITAR PREGUNTA DE DECLARACIONES JURADAS`,
          edit: true,
          par_modo: 'U',
          modelo_formulario: preguntaDDJJ.modelo_formulario,
          nro_preg: preguntaDDJJ.nro_preg,
          cantidad_lineas_resp: preguntaDDJJ.cantidad_lineas_resp,
          pide_fecha: preguntaDDJJ.pide_fecha,
          yes_no: preguntaDDJJ.yes_no,
          primer_texto_preg: preguntaDDJJ.primer_texto_preg,
          segundo_texto_preg: preguntaDDJJ.segundo_texto_preg,
        },
      }
    );

    modalEditPreguntasDDJJ.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.preguntaDDJJService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La pregunta de declaraciones juradas se ha editado exitosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.editPreguntaDDJJ(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  modelo_formulario: preguntaDDJJ.modelo_formulario,
                  nro_preg: preguntaDDJJ.nro_preg,
                });
                this.getPreguntaDDJJ();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewPreguntaDDJJ(preguntaDDJJ: IPreguntaDDJJ): void {
    this.dialog.open(AddEditPreguntaDDJJDialogComponent, {
      data: {
        title: `VER PREGUNTA DE DECLARACIONES JURADAS`,
        edit: false,
        par_modo: 'C',
        modelo_formulario: preguntaDDJJ?.modelo_formulario,
        nro_preg: preguntaDDJJ?.nro_preg,
        cantidad_lineas_resp: preguntaDDJJ?.cantidad_lineas_resp,
        pide_fecha: preguntaDDJJ?.pide_fecha,
        yes_no: preguntaDDJJ?.yes_no,
        primer_texto_preg: preguntaDDJJ?.primer_texto_preg,
        segundo_texto_preg: preguntaDDJJ?.segundo_texto_preg,
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getPreguntaDDJJ();
  }
}

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PreguntasDDJJService } from 'src/app/core/services/preguntas-ddjj.service';

// * Interfaces
import { PreguntasDDJJ } from 'src/app/core/models/preguntas-ddjj';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditPreguntasDDJJDialogComponent } from '../add-edit-preguntas-ddjj-dialog/add-edit-preguntas-ddjj-dialog.component';

@Component({
  selector: 'app-preguntas-ddjj-dashboard',
  templateUrl: './preguntas-ddjj-dashboard.component.html',
  styleUrls: ['./preguntas-ddjj-dashboard.component.scss'],
})
export class PreguntasDDJJDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'nro_preg',
    'primer_texto_preg',
    'segundo_texto_preg',
    'pide_fecha',
    'yes_no',
    'actions',
  ];

  public dataSource: MatTableDataSource<PreguntasDDJJ>;

  public searchValue: string = '';

  public preguntasDDJJ: PreguntasDDJJ[] = [];

  constructor(
    private preguntasDDJJService: PreguntasDDJJService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getPreguntasDDJJ(): void {
    this.utils.openLoading();
    this.preguntasDDJJService.getPreguntasDDJJCRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.preguntasDDJJ = res.dataset as PreguntasDDJJ[])
          : (this.preguntasDDJJ = [res.dataset]);
        this.dataSource = new MatTableDataSource<PreguntasDDJJ>(
          this.preguntasDDJJ
        );
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

  public editPreguntasDDJJ(preguntasDDJJ: PreguntasDDJJ): void {
    const modalEditPreguntasDDJJ = this.dialog.open(
      AddEditPreguntasDDJJDialogComponent,
      {
        data: {
          title: `EDITAR PREGUNTA DE DECLARACIONES JURADAS`,
          edit: true,
          par_modo: 'U',
          modelo_formulario: preguntasDDJJ.modelo_formulario,
          nro_preg: preguntasDDJJ.nro_preg,
          cantidad_lineas_resp: preguntasDDJJ.cantidad_lineas_resp,
          pide_fecha: preguntasDDJJ.pide_fecha,
          yes_no: preguntasDDJJ.yes_no,
          primer_texto_preg: preguntasDDJJ.primer_texto_preg,
          segundo_texto_preg: preguntasDDJJ.segundo_texto_preg,
        },
      }
    );

    modalEditPreguntasDDJJ.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.preguntasDDJJService.getPreguntasDDJJCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Pregunta de Declaraciones Juradas se ha editado exitosamente.',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.editPreguntasDDJJ(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({par_modo: 'R', modelo_formulario: preguntasDDJJ.modelo_formulario, nro_preg: preguntasDDJJ.nro_preg });
                this.getPreguntasDDJJ();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewPreguntasDDJJ(preguntasDDJJ: PreguntasDDJJ): void {
    this.dialog.open(AddEditPreguntasDDJJDialogComponent, {
      data: {
        title: `VER PREGUNTA DE DECLARACIONES JURADAS`,
        edit: false,
        par_modo: 'C',
        modelo_formulario: preguntasDDJJ?.modelo_formulario,
        nro_preg: preguntasDDJJ?.nro_preg,
        cantidad_lineas_resp: preguntasDDJJ?.cantidad_lineas_resp,
        pide_fecha: preguntasDDJJ?.pide_fecha,
        yes_no: preguntasDDJJ?.yes_no,
        primer_texto_preg: preguntasDDJJ?.primer_texto_preg,
        segundo_texto_preg: preguntasDDJJ?.segundo_texto_preg,
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getPreguntasDDJJ();
  }
}

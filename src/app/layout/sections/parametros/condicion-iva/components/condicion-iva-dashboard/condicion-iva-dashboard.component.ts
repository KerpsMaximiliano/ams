import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { CondicionIvaService } from 'src/app/core/services/condicion-iva.service';
import { UtilService } from 'src/app/core/services/util.service';

// * Interface
import { ICondicionIva } from 'src/app/core/models/condicion-iva.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

// * Componentes
import { AddEditCondicionIvaDialogComponent } from '../add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';

@Component({
  selector: 'app-condicion-iva-dashboard',
  templateUrl: './condicion-iva-dashboard.component.html',
  styleUrls: ['./condicion-iva-dashboard.component.scss'],
})
export class CondicionIvaDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo_de_IVA',
    'descripcion',
    'descripcion_reducida',
    'formulario_AB',
    'actions',
  ];

  public dataSource: MatTableDataSource<ICondicionIva>;

  public searchValue: string;

  public documents: ICondicionIva[] = [];

  constructor(
    private tipoCondicionService: CondicionIvaService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getCondicionIva(): void {
    this.utils.openLoading();
    this.tipoCondicionService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        this.documents = res.dataset as ICondicionIva[];
        this.dataSource = new MatTableDataSource<ICondicionIva>(this.documents);
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

  public editCondicionIVA(tipoCondicion: ICondicionIva): void {
    const modalNuevaCondicionIva = this.dialog.open(
      AddEditCondicionIvaDialogComponent,
      {
        data: {
          title: `EDITAR CONDICIÓN DE IVA`,
          par_modo: 'U',
          edit: true,
          codigo_de_IVA: tipoCondicion.codigo_de_IVA,
          descripcion: tipoCondicion.descripcion,
          descripcion_reducida: tipoCondicion.descripcion_reducida,
          formulario_AB: tipoCondicion.formulario_AB,
        },
      }
    );

    modalNuevaCondicionIva.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.tipoCondicionService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Condición IVA se ha editado extiosamente.',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.editCondicionIVA(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'C',
                  descripcion: res.descripcion,
                });
                this.getCondicionIva();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewCondicionIVA(tipoCondicion: ICondicionIva): void {
    this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `VER CONDICIÓN DE IVA`,
        par_modo: 'C',
        codigo_de_IVA: tipoCondicion.codigo_de_IVA,
        descripcion: tipoCondicion.descripcion,
        descripcion_reducida: tipoCondicion.descripcion_reducida,
        formulario_AB: tipoCondicion.formulario_AB,
      },
    });
  }

  public filter(buscar: string): void {
    this.searchValue = buscar;
    this.getCondicionIva();
  }
}

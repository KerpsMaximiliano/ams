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

  public searchValue: string;
  public condicionIva: ICondicionIva[] = [];
  public displayedColumns: string[] = [
    'codigo_de_IVA',
    'descripcion',
    'descripcion_reducida',
    'formulario_AB',
    'actions',
  ];
  public dataSource: MatTableDataSource<ICondicionIva>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private tipoCondicionService: CondicionIvaService
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

  private getCondicionIva(): void {
    this.utils.openLoading();
    this.tipoCondicionService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.condicionIva = res.dataset as ICondicionIva[])
          : (this.condicionIva = [res.dataset]);
        this.dataSource = new MatTableDataSource<ICondicionIva>(
          this.condicionIva
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

  public editCondicionIVA(condicionIva: ICondicionIva): void {
    const modalNuevaCondicionIva = this.dialog.open(
      AddEditCondicionIvaDialogComponent,
      {
        data: {
          title: `EDITAR CONDICIÓN DE IVA`,
          edit: true,
          par_modo: 'U',
          codigo_de_IVA: condicionIva.codigo_de_IVA,
          descripcion: condicionIva.descripcion,
          descripcion_reducida: condicionIva.descripcion_reducida,
          formulario_AB: condicionIva.formulario_AB,
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
                'La condición de iva se ha editado extiosamente. ',
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
              this.editCondicionIVA(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  codigo_de_IVA: res.codigo_de_IVA,
                });
                this.getCondicionIva();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewCondicionIVA(condicionIva: ICondicionIva): void {
    this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: `VER CONDICIÓN DE IVA`,
        edit: false,
        par_modo: 'R',
        codigo_de_IVA: condicionIva.codigo_de_IVA,
        descripcion: condicionIva.descripcion,
        descripcion_reducida: condicionIva.descripcion_reducida,
        formulario_AB: condicionIva.formulario_AB,
      },
    });
  }

  public filter(data: string): void {
    this.searchValue = data;
    this.getCondicionIva();
  }
}

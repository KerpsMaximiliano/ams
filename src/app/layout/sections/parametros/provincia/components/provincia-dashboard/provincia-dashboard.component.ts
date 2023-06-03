import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditProvinciaDialogComponent } from '../add-edit-provincia-dialog/add-edit-provincia-dialog.component';

@Component({
  selector: 'app-provincia-dashboard',
  templateUrl: './provincia-dashboard.component.html',
  styleUrls: ['./provincia-dashboard.component.scss'],
})
export class ProvinciaDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchText: string;
  public provincia: IProvincia[] = [];
  public displayedColumns: string[] = [
    'codigo',
    'nombre_provincia',
    'codigo_provincia',
    'codifica_altura',
    'flete_transportista',
    'actions',
  ];
  public dataSource: MatTableDataSource<IProvincia>;

  constructor(
    private provinciaService: ProvinciaService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
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

  private getProvincia(): void {
    this.utils.openLoading();
    let body = JSON.stringify({
      par_modo: 'C',
      nombre_provincia: this.searchText,
    });
    this.provinciaService.CRUD(body).subscribe({
      next: (res: any) => {
        this.provincia = res.dataset as IProvincia[];
        this.dataSource = new MatTableDataSource<IProvincia>(this.provincia);
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

  public editProvincia(provincia: IProvincia): void {
    const modalNuevaProvincia = this.dialog.open(
      AddEditProvinciaDialogComponent,
      {
        data: {
          title: `EDITAR PROVINCIA`,
          edit: true,
          par_modo: 'U',
          codigo: provincia?.codigo,
          nombre_provincia: provincia?.nombre_provincia,
          codifica_altura: provincia?.codifica_altura,
          codigo_provincia: provincia?.codigo_provincia,
          flete_transportista: provincia?.flete_transportista,
        },
      }
    );

    modalNuevaProvincia.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.provinciaService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Provincia se ha editado extiosamente. ',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.editProvincia(res);
            },
            complete: () => {
              this.searchText = res.nombre_provincia.trim();
              this.utils.closeLoading();
              setTimeout(() => {
                this.getProvincia();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewProvincia(provincia: IProvincia): void {
    this.dialog.open(AddEditProvinciaDialogComponent, {
      data: {
        title: `VER PROVINCIA`,
        edit: false,
        id_tabla: 9,
        codigo: provincia?.codigo,
        nombre_provincia: provincia?.nombre_provincia,
        codifica_altura: provincia?.codifica_altura,
        codigo_provincia: provincia?.codigo_provincia,
        flete_transportista: provincia?.flete_transportista,
      },
    });
  }

  public filter(data: string): void {
    this.searchText = data;
    this.getProvincia();
  }
}

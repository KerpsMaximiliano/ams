import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';

// * Interfaces
import { IObraSocial } from 'src/app/core/models/obra-social.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditObraSocialDialogComponent } from '../add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';

@Component({
  selector: 'app-obra-social-dashboard',
  templateUrl: './obra-social-dashboard.component.html',
  styleUrls: ['./obra-social-dashboard.component.scss'],
})
export class ObraSocialDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public searchValue: string = '';
  public obrasSociales: IObraSocial[] = [];
  public displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'tipo_obra_social_prepaga',
    'nro_registro',
    'similar_SMP',
    'omite_R420',
    'actions',
  ];
  public dataSource: MatTableDataSource<IObraSocial>;

  constructor(
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private obraSocialService: ObraSocialService
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

  private getobraSocial(): void {
    this.utils.openLoading();
    this.obraSocialService.CRUD(this.searchValue).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.obrasSociales = res.dataset as IObraSocial[])
          : (this.obrasSociales = [res.dataset]);
        this.dataSource = new MatTableDataSource<IObraSocial>(
          this.obrasSociales
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

  public editObraSocial(obraSocial: IObraSocial): void {
    const modalNuevoObraSocial = this.dialog.open(
      AddEditObraSocialDialogComponent,
      {
        data: {
          title: `EDITAR OBRA SOCIAL`,
          edit: true,
          par_modo: 'U',
          codigo: obraSocial.codigo,
          descripcion: obraSocial.descripcion,
          propone_fecha_patologia: obraSocial.propone_fecha_patologia,
          tipo_fecha_patologia: obraSocial.tipo_fecha_patologia,
          tipo_obra_social_prepaga: obraSocial.tipo_obra_social_prepaga,
          nro_registro: obraSocial.nro_registro,
          similar_SMP: obraSocial.similar_SMP,
          omite_R420: obraSocial.omite_R420,
        },
      }
    );

    modalNuevoObraSocial.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.obraSocialService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La obra social se ha editado extiosamente. ',
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
              this.editObraSocial(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                  par_modo: 'R',
                  codigo: res.codigo,
                });
                this.getobraSocial();
              }, 300);
            },
          });
        }
      },
    });
  }

  public viewObraSocial(obraSocial: IObraSocial): void {
    this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: `VER OBRA SOCIAL`,
        edit: false,
        par_modo: 'R',
        codigo: obraSocial.codigo,
        descripcion: obraSocial.descripcion,
        propone_fecha_patologia: obraSocial.propone_fecha_patologia,
        tipo_fecha_patologia: obraSocial.tipo_fecha_patologia,
        tipo_obra_social_prepaga: obraSocial.tipo_obra_social_prepaga,
        nro_registro: obraSocial.nro_registro,
        similar_SMP: obraSocial.similar_SMP,
        omite_R420: obraSocial.omite_R420,
      },
    });
  }

  public getTipo(tipo: string): string {
    switch (tipo) {
      case 'O':
        return 'OBRA SOCIAL';
      case 'P':
        return 'PREPAGA';
      case 'A':
        return 'AMBAS';
      default:
        return '';
    }
  }

  public filter(buscar: string): void {
    this.searchValue = buscar;
    this.getobraSocial();
  }
}

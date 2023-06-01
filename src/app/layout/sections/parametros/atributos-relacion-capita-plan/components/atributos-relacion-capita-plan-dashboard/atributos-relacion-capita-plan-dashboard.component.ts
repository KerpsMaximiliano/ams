import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { AtributosRelacionCapitaPlanService } from 'src/app/core/services/atributos-relacion-capita-plan.service';

// * Interfaces
import { IAtributosRelacionCapitaPlan } from 'src/app/core/models/atributos-relacion-capita-plan.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

// * Components
import { AddEditAtributosRelacionCapitaPlanDialogComponent } from '../add-edit-atributos-relacion-capita-plan-dialog/add-edit-atributos-relacion-capita-plan-dialog.component';

@Component({
  selector: 'app-atributos-relacion-capita-plan-dashboard',
  templateUrl: './atributos-relacion-capita-plan-dashboard.component.html',
  styleUrls: ['./atributos-relacion-capita-plan-dashboard.component.scss'],
})
export class AtributosRelacionCapitaPlanDashboardComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'plan_one',
    'liquidacion',
    'plan_two',
    'actions',
  ];

  public dataSource: MatTableDataSource<IAtributosRelacionCapitaPlan>;

  public searchValue: string = '';

  public atributosRelacionCapitaPlan: IAtributosRelacionCapitaPlan[] = [];

  constructor(
    private atributosRelacionCapitaPlanService: AtributosRelacionCapitaPlanService,
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


  private getAtributosRelacionCapitaPlan(): void {
    this.utils.openLoading();
    this.atributosRelacionCapitaPlanService
      .getAtributosRelacionCapitaPlanCRUD(this.searchValue)
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.atributosRelacionCapitaPlan =
                res.dataset as IAtributosRelacionCapitaPlan[])
            : (this.atributosRelacionCapitaPlan = [res.dataset]);
          this.dataSource =
            new MatTableDataSource<IAtributosRelacionCapitaPlan>(
              this.atributosRelacionCapitaPlan
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

  public editAtributosRelacionCapitaPlan(
    atributosRelacionCapitaPlan: IAtributosRelacionCapitaPlan
  ): void {
    const modalEditAtributosRelacionCapitaPlan = this.dialog.open(
      AddEditAtributosRelacionCapitaPlanDialogComponent,
      {
        data: {
          title: `EDITAR`,
          edit: true,
          par_modo: 'U',
          // * Verificar
        },
      }
    );

    modalEditAtributosRelacionCapitaPlan.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.atributosRelacionCapitaPlanService
            .getAtributosRelacionCapitaPlanCRUD(res)
            .subscribe({
              next: () => {
                this.utils.notification(
                  'La ? se ha editado exitosamente.', // * Verificcar
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
                this.editAtributosRelacionCapitaPlan(res);
              },
              complete: () => {
                this.utils.closeLoading();
                setTimeout(() => {
                  this.searchValue = JSON.stringify({
                    par_modo: 'R',
                  });
                  this.getAtributosRelacionCapitaPlan();
                }, 300); // * VERIFICAR
              },
            });
        }
      },
    });
  }

  public viewAtributosRelacionCapitaPlan(
    atributosRelacionCapitaPlan: IAtributosRelacionCapitaPlan
  ): void {
    this.dialog.open(AddEditAtributosRelacionCapitaPlanDialogComponent, {
      data: {
        title: `VER `, // * VERIFICAR
        edit: false,
        par_modo: 'C',
      },
    });
  }

  public filter(descripcion: string): void {
    this.searchValue = descripcion;
    this.getAtributosRelacionCapitaPlan();
  }
}

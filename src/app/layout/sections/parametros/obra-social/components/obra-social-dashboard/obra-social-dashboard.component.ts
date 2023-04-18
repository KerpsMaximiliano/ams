import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ObraSocial, ObraSocialResponse } from 'src/app/core/models/obra-social.interface';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditObraSocialDialogComponent } from '../add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-obra-social-dashboard',
  templateUrl: './obra-social-dashboard.component.html',
  styleUrls: ['./obra-social-dashboard.component.scss']
})
export class ObraSocialDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'tipo',
    'numeroRegistroNacional',
    'simil',
    'omite_R420',
    'actions'
  ];

  public dataSource: MatTableDataSource<ObraSocial>;

  public searchValue: string;
  public obrasSociales: ObraSocial[] = [];

  constructor(private obraSocialService: ObraSocialService,
    private utils: UtilService,
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getobraSocial(): void {
    this.utils.openLoading();
    console.log(this.searchValue)
    this.obraSocialService.getObraSocialCrud(this.searchValue).subscribe({
      next: (res: any) => {
        (res.dataset.length)
          ? this.obrasSociales = res.dataset as ObraSocial[]
          : this.obrasSociales = [res.dataset];
        this.dataSource = new MatTableDataSource<ObraSocial>(this.obrasSociales);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " + (this.paginator.pageIndex + 1) + " de " + this.paginator.length
          }
        }, 100)
      },
      error: (err: any) => {
        this.utils.closeLoading();
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error')
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      },
      complete: () => {
        this.utils.closeLoading();
      }
    });
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public editObraSocial(obraSocial: ObraSocial): void {
    const modalNuevoObraSocial = this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: `Editar Obra Social`,
        par_modo: "U",
        codigo: obraSocial.codigo,
        descripcion: obraSocial.descripcion,
        propone_fecha_patologia: obraSocial.propone_fecha_patologia,
        tipo_fecha_patologia: obraSocial.tipo_fecha_patologia,
        tipo_obra_social_prepaga: obraSocial.tipo_obra_social_prepaga,
        nro_registro: obraSocial.nro_registro,
        similar_SMP: obraSocial.similar_SMP,
        omite_R420: obraSocial.omite_R420,
        edit: true
      }
    });

    modalNuevoObraSocial.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.obraSocialService.getObraSocialCrud(res).subscribe({
            next: () => {
              this.utils.notification("La Obra Social se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editObraSocial(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.searchValue = JSON.stringify({
                    par_modo: "C",
                    descripcion: res.descripcion
                  })
                this.getobraSocial();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewObraSocial(obraSocial: ObraSocial): void {
    this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: `Ver Obra Social`,
        par_modo: "C",
        codigo: obraSocial.codigo,
        descripcion: obraSocial.descripcion,
        propone_fecha_patologia: obraSocial.propone_fecha_patologia,
        tipo_fecha_patologia: obraSocial.tipo_fecha_patologia,
        tipo_obra_social_prepaga: obraSocial.tipo_obra_social_prepaga,
        nro_registro: obraSocial.nro_registro,
        similar_SMP: obraSocial.similar_SMP,
        omite_R420: obraSocial.omite_R420,
        edit: false
      }
    });
  }


  public deleteObraSocial(obraSocial: ObraSocial): void {
    const modalConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Eliminar Obra Social`,
        message: `¿Está seguro de eliminar la Obra Social ${obraSocial.descripcion}?`
      }
    });

    modalConfirm.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.obraSocialService.getObraSocialCrud(res.id).subscribe({
            next: (res: any) => {
              this.utils.notification("La Obra Social se ha borrado exitosamente", 'success')
              this.getobraSocial();
            },
            error: (err) => {
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
            }
          });
        }
      }
    })
  }

  public filter(buscar: string):void {
    this.searchValue = buscar;
      this.getobraSocial()
  }
}
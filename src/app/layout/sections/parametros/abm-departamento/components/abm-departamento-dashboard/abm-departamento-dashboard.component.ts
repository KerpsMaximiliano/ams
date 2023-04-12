import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AbmDepartamento } from 'src/app/core/models/abm-departamento';
import { DepartamentoService } from 'src/app/core/services/abm-departamento.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EditAbmDepartamentoDialogComponent } from '../edit-abm-departamento-dialog/edit-abm-departamento-dialog.component';

@Component({
  selector: 'app-abm-departamento-dashboard',
  templateUrl: './abm-departamento-dashboard.component.html',
  styleUrls: ['./abm-departamento-dashboard.component.scss']
})
export class AbmDepartamentoDashboardComponent {

  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);
  @ViewChild(MatTable) table!: MatTable<any>;

  public displayedColumns: string[] = [
    'letra_provincia',
    'codigo_departamento',
    'descripcion',
    'descripcion_reducida',
    'actions'
  ];

  public dataSource: MatTableDataSource<AbmDepartamento>;

  public searchValue: string;
  public departamentos: AbmDepartamento[] = [];

  constructor(private departamentoService: DepartamentoService,
              private utils: UtilService,
              private _liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
  }

  private getAbmDepartamento(): void {
    this.utils.openLoading();
    this.departamentoService.getDeparByDesc(this.searchValue).subscribe({
      next:(res:any) => {
        this.departamentos = res.dataset as AbmDepartamento[];
        this.dataSource = new MatTableDataSource<AbmDepartamento>(this.departamentos);
        this.dataSource.sort = this.sort;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.getRangeLabel = (): string => {
            return "Página " +  (this.paginator.pageIndex + 1) + " de " +  this.paginator.length
          }
        }, 100)
      },
      error:(err: any) => {
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

  public editdeparType(abmDepartamento: AbmDepartamento): void {
    const modalNuevoAbmDepartamento = this.dialog.open(EditAbmDepartamentoDialogComponent, {
      data: {
        title: `Editar Departamento`,
        par_modo: "U",
        id_tabla: 10,
        letra_provincia: abmDepartamento?.letra_provincia,
        codigo_departamento: abmDepartamento?.codigo_departamento,
        descripcion: abmDepartamento?.descripcion,
        descripcion_reducida: abmDepartamento?.descripcion_reducida,
        edit: true
      }
    });

    modalNuevoAbmDepartamento.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.departamentoService.editDepar(res).subscribe({
            next: () => {
              this.utils.notification("El Departamento se ha editado extiosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.editdeparType(res)
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.getAbmDepartamento();
              }, 300);
            }
          });
        }
      }
    });
  }

  public viewdeparType(abmDepartamento: AbmDepartamento): void {
    this.dialog.open(EditAbmDepartamentoDialogComponent, {
      data: {
        title: `Ver Departamento`,
        id_tabla: 10,
        letra_provincia: abmDepartamento?.letra_provincia,
        codigo_departamento: abmDepartamento?.codigo_departamento,
        descripcion: abmDepartamento?.descripcion,
        descripcion_reducida: abmDepartamento?.descripcion_reducida,
        edit: false
      }
    });
  }

  public filter(buscar: any): void {
    if (buscar.codigo_departamento != null) buscar.codigo_departamento = Number(buscar.codigo_departamento);
    this.searchValue = JSON.stringify(buscar);
    console.log(buscar);
    (buscar.letra_provincia != "")
      ? this.getAbmDepartamento()
      : this.dataSource.data = [] 
  }
}
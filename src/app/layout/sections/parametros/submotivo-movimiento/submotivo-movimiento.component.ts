import { UtilService } from 'src/app/core/services/util.service';
import { SubmotivoMovimientoService } from 'src/app/core/services/submotivo-movimiento.service';
// * Interfaces
import { ISubmotivoMovimiento } from 'src/app/core/models/submotivo-movimiento';
// * Material
import { MatDialog } from '@angular/material/dialog';
// * Others
import { Component, ViewChild } from '@angular/core';
import { AddEditSubmotivoMovimientoComponent } from './components/add-edit-submotivo-movimiento/add-edit-submotivo-movimiento.component';
import { SubmotivoMovimientoDashboardComponent } from './components/submotivo-movimiento-dashboard/submotivo-movimiento-dashboard.component';

@Component({
  selector: 'app-submotivo-movimiento',
  templateUrl: './submotivo-movimiento.component.html',
  styleUrls: ['./submotivo-movimiento.component.scss'],
})
export class SubmotivoMovimientoComponent {
  @ViewChild(SubmotivoMovimientoDashboardComponent)
  dashboard: SubmotivoMovimientoDashboardComponent;

  movimiento: ISubmotivoMovimiento;
  constructor(
    private SubmotivoMovimientoService: SubmotivoMovimientoService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {
    this.movimiento = this.SubmotivoMovimientoService.get();
  }

  ngOnInit() {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter();
  }

  public nuevoSubmotivo(): void {
    const modalNuevosubmotivo = this.dialog.open(
      AddEditSubmotivoMovimientoComponent,
      {
        data: {
          title: `CREAR SUBTIPO DE MOVIMIENTO`,
          edit: true,
          par_modo: 'C',
          movimiento: 'B', //this.movimiento?.movimiento,
          codigo_motivo: 12, // this.movimiento?.codigo_motivo,
          producto: 'prueba', // this.movimiento?.producto,
          codigo_producto: 10, // this.movimiento?.codigo_producto
        },
      }
    );
    modalNuevosubmotivo.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          let body = res;
          this.utils.openLoading();
          this.SubmotivoMovimientoService.CRUD(body).subscribe({
            next: () => {
              this.utils.notification(
                'El submotivo se ha creado exitosamente',
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
              this.nuevoSubmotivo();
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch('');
              }, 300);
            },
          });
        }
      },
    });
  }
}

import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';

// * Interfaces
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Componentes
import { AddEditMotivoMovimientoDialogComponent } from './components/add-edit-motivo-movimiento-dialog/add-edit-motivo-movimiento-dialog.component';
import { MotivoMovimientoDashboardComponent } from './components/motivo-movimiento-dashboard/motivo-movimiento-dashboard.component';

@Component({
  selector: 'app-motivo-movimiento',
  templateUrl: './motivo-movimiento.component.html',
  styleUrls: ['./motivo-movimiento.component.scss'],
})
export class MotivoMovimientoComponent {
  @ViewChild(MotivoMovimientoDashboardComponent)
  dashboard: MotivoMovimientoDashboardComponent;

  constructor(
    private motivoMovimientoService: MotivoMovimientoService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoMotivoMovimiento(motivoMovimiento?: IMotivoMovimiento): void {
    const modalNuevoMotivoMovimiento = this.dialog.open(
      AddEditMotivoMovimientoDialogComponent,
      {
        data: {
          title: `CREAR MOTIVO DE MOVIMIENTO`,
          edit: true,
          par_modo: 'I',
          id: 99,
          id_motivo: motivoMovimiento?.id_motivo,
          tipo_motivo: motivoMovimiento?.tipo_motivo,
          descripcion: motivoMovimiento?.descripcion,
          datos_adic_SN: motivoMovimiento?.datos_adic_SN,
          fecha_inicio_vigencia: motivoMovimiento?.fecha_inicio_vigencia,
          fecha_fin_vigencia: motivoMovimiento?.fecha_fin_vigencia,
        },
      }
    );
    modalNuevoMotivoMovimiento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.motivoMovimientoService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El motivo de movimiento se ha creado exitosamente. ',
                'success'
              );
            },
            error: (error) => {
              this.utils.closeLoading();
              error.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${error.error.estado.Codigo}: ${error.error.estado.Mensaje}. `,
                    'error'
                  );
              this.nuevoMotivoMovimiento(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C',
                    tipo_motivo: res.tipo_motivo[0],
                    descripcion: res.descripcion,
                  })
                );
              }, 300);
            },
          });
        }
      },
    });
  }
}

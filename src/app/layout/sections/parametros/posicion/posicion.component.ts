import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PosicionService } from 'src/app/core/services/posicion.service';

// * Interfaces
import { IPosicion } from 'src/app/core/models/posicion.interface';

// * Interfaces
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditPosicionDialogComponent } from './add-edit-posicion-dialog/add-edit-posicion-dialog.component';
import { PosicionDashboardComponent } from './posicion-dashboard/posicion-dashboard.component';

@Component({
  selector: 'app-posicion',
  templateUrl: './posicion.component.html',
  styleUrls: ['./posicion.component.scss'],
})
export class PosicionComponent {
  @ViewChild(PosicionDashboardComponent)
  dashboard: PosicionDashboardComponent;

  constructor(
    private posicionService: PosicionService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaPosicion(posicion?: IPosicion): void {
    const modalNuevaPosicion = this.dialog.open(
      AddEditPosicionDialogComponent,
      {
        data: {
          title: `NUEVA POSICIÓN`,
          edit: true,
          codigo_posicion: posicion?.codigo_posicion,
          descripcion: posicion?.descripcion,
          domicilio: posicion?.domicilio,
          codigo_postal: posicion?.codigo_postal,
          sub_codigo_postal: posicion?.sub_codigo_postal,
          control_rechazo: posicion?.control_rechazo,
          yes_no: posicion?.yes_no,
          fecha_vigencia: posicion?.fecha_vigencia,
          letra_provincia: posicion?.letra_provincia,
        },
      }
    );

    modalNuevaPosicion.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.posicionService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La posición se ha creado exitosamente. ',
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
              this.nuevaPosicion(res);
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

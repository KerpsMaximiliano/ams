import { Component, ViewChild } from '@angular/core';

// * SERVICES
import { UtilService } from 'src/app/core/services/util.service';
import { PosicionService } from 'src/app/core/services/posicion.service';

// * MATERIAL
import { MatDialog } from '@angular/material/dialog';

// * COMPONENTS
import { IPosicion } from 'src/app/core/models/posicion.interface';
import { AddEditAbmPosicionesComponent } from './add-edit-abm-posiciones/add-edit-abm-posiciones.component';
import { AbmPosicionesDashboardComponent } from './abm-posiciones-dashboard/abm-posiciones-dashboard.component';

@Component({
  selector: 'app-abm-posiciones',
  templateUrl: './abm-posiciones.component.html',
  styleUrls: ['./abm-posiciones.component.scss'],
})
export class AbmPosicionesComponent {
  @ViewChild(AbmPosicionesDashboardComponent)
  dashboard: AbmPosicionesDashboardComponent;

  constructor(
    private posicionesService: PosicionService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaPosicion(posiciones?: IPosicion): void {
    const modalNuevaPosicion = this.dialog.open(AddEditAbmPosicionesComponent, {
      data: {
        title: `Nueva Posicion`,
        edit: true,
        codigo_posicion: posiciones?.codigo_posicion,
        descripcion: posiciones?.descripcion,
        domicilio: posiciones?.domicilio,
        codigo_postal: posiciones?.codigo_postal,
        sub_codigo_postal: posiciones?.sub_codigo_postal,
        control_rechazo: posiciones?.control_rechazo,
        yes_no: posiciones?.yes_no,
        fecha_vigencia: posiciones?.fecha_vigencia,
        letra_provincia: posiciones?.letra_provincia,
      },
    });

    modalNuevaPosicion.afterClosed().subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.utils.openLoading();
          this.posicionesService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La Posicion se ha creado exitosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
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

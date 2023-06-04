import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Interfaces
import { ILocalidad } from 'src/app/core/models/localidad.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { LocalidadDashboardComponent } from './components/localidad-dashboard/localidad-dashboard.component';
import { AddEditLocalidadDialogComponent } from './components/add-edit-localidad-dialog/add-edit-localidad-dialog.component';

@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.scss'],
})
export class LocalidadComponent {
  @ViewChild(LocalidadDashboardComponent)
  dashboard: LocalidadDashboardComponent;

  constructor(
    private LocalidadesService: LocalidadService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaLocalidad(localidad?: ILocalidad): void {
    const modalNuevoLocalidad = this.dialog.open(
      AddEditLocalidadDialogComponent,
      {
        data: {
          title: `NUEVA LOCALIDAD`,
          edit: true,
          id_tabla: 9,
          codigo_postal: localidad?.codigo_postal,
          sub_codigo_postal: localidad?.sub_codigo_postal,
          descripcion: localidad?.descripcion,
          letra_provincia: localidad?.letra_provincia,
          flete_transporte: localidad?.flete_transporte,
          posicion_referente: localidad?.posicion_referente,
          visitado_auditor: localidad?.visitado_auditor,
          zona_promocion: localidad?.zona_promocion,
          codigo_departamento: localidad?.codigo_departamento,
          zona_envio: localidad?.zona_envio,
          ingreso_ticket: localidad?.ingreso_ticket,
          zona_atencion: localidad?.zona_atencion,
          cant_habitantes: localidad?.cant_habitantes,
        },
      }
    );

    modalNuevoLocalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.LocalidadesService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La localidad se ha creado exitosamente. ',
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
              this.nuevaLocalidad(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {}, 300);
            },
          });
        }
      },
    });
  }
}

import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';

// * Interfaces
import { Nacionalidad } from 'src/app/core/models/nacionalidad';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { NacionalidadDashboardComponent } from './components/nacionalidad-dashboard/nacionalidad-dashboard.component';
import { EditNacionalidadDialogComponent } from './components/edit-nacionalidad-dialog/edit-nacionalidad-dialog.component';

@Component({
  selector: 'app-nacionalidad',
  templateUrl: './nacionalidad.component.html',
  styleUrls: ['./nacionalidad.component.scss'],
})
export class NacionalidadComponent {
  @ViewChild(NacionalidadDashboardComponent)
  dashboard: NacionalidadDashboardComponent;

  constructor(
    private nacionalidadService: NacionalidadService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaNacionalidad(nacionalidad?: Nacionalidad): void {
    const modalNuevaNacionalidad = this.dialog.open(
      EditNacionalidadDialogComponent,
      {
        data: {
          title: `Nueva Nacionalidad`,
          edit: true,
          id_tabla: 3,
          codigo_nacionalidad_nuevo: nacionalidad?.codigo_nacionalidad_nuevo,
          descripcion: nacionalidad?.descripcion,
          codigo_sistema_anterior: nacionalidad?.codigo_sistema_anterior,
        },
      }
    );

    modalNuevaNacionalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.nacionalidadService.addNacionalidad(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La Nacionalidad se ha creado exitosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevaNacionalidad(res);
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

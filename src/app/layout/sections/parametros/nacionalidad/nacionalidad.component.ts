import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';

// * Interfaces
import { INacionalidad } from 'src/app/core/models/nacionalidad.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditNacionalidadDialogComponent } from './components/add-edit-nacionalidad-dialog/add-edit-nacionalidad-dialog.component';
import { NacionalidadDashboardComponent } from './components/nacionalidad-dashboard/nacionalidad-dashboard.component';

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

  public nuevaNacionalidad(nacionalidad?: INacionalidad): void {
    const modalNuevaNacionalidad = this.dialog.open(
      AddEditNacionalidadDialogComponent,
      {
        data: {
          title: `NUEVA NACIONALIDAD`,
          edit: true,
          par_modo: 'C',
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
          this.nacionalidadService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'La nacionalidad se ha creado exitosamente. ',
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
              this.nuevaNacionalidad(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(res.codigo_nacionalidad_nuevo.trim());
              }, 300);
            },
          });
        }
      },
    });
  }
}

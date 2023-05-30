import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EstadoCivilService } from 'src/app/core/services/estado-civil.service';

// * Interfaces
import { EstadoCivil } from 'src/app/core/models/estado-civil';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditEstadoCivilDialogComponent } from './components/add-edit-estado-civil-dialog/add-edit-estado-civil-dialog.component';
import { EstadoCivilDashboardComponent } from './components/estado-civil-dashboard/estado-civil-dashboard.component';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.scss'],
})
export class EstadoCivilComponent {
  @ViewChild(EstadoCivilDashboardComponent)
  dashboard: EstadoCivilDashboardComponent;

  constructor(
    private estadoCivilService: EstadoCivilService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoEstadoCivil(estadoCivil?: EstadoCivil): void {
    const modalNuevoEstadoCivil = this.dialog.open(
      AddEditEstadoCivilDialogComponent,
      {
        data: {
          title: `CREAR ESTADO CIVIL`,
          edit: true,
          par_modo: 'I',
          codigo_estado_civil: estadoCivil?.codigo_estado_civil,
          description: estadoCivil?.description,
        },
      }
    );

    modalNuevoEstadoCivil.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.estadoCivilService.getEstadoCivilCRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'El Estado Civil se ha creado exitosamente.',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevoEstadoCivil(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C',
                    description: res.description,
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

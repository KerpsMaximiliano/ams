import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';

// * Interfaces
import { IObraSocial } from 'src/app/core/models/obra-social.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditObraSocialDialogComponent } from './components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialDashboardComponent } from './components/obra-social-dashboard/obra-social-dashboard.component';

@Component({
  selector: 'app-obra-social',
  templateUrl: './obra-social.component.html',
  styleUrls: ['./obra-social.component.scss'],
})
export class ObraSocialComponent {
  @ViewChild(ObraSocialDashboardComponent)
  dashboard: ObraSocialDashboardComponent;

  constructor(
    private utils: UtilService,
    private dialog: MatDialog,
    private obraSocialService: ObraSocialService
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoObraSocial(obraSocial?: IObraSocial): void {
    const modalNuevoObraSocial = this.dialog.open(
      AddEditObraSocialDialogComponent,
      {
        data: {
          title: `CREAR OBRA SOCIAL`,
          edit: true,
          par_modo: 'C',
          codigo: obraSocial?.codigo,
          descripcion: obraSocial?.descripcion,
          propone_fecha_patologia: obraSocial?.propone_fecha_patologia,
          tipo_fecha_patologia: obraSocial?.tipo_fecha_patologia,
          tipo_obra_social_prepaga: obraSocial?.tipo_obra_social_prepaga,
          nro_registro: obraSocial?.nro_registro,
          similar_SMP: obraSocial?.similar_SMP,
          omite_R420: obraSocial?.omite_R420,
        },
      }
    );

    modalNuevoObraSocial.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.obraSocialService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La obra social se ha creado exitosamente. ',
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
              this.nuevoObraSocial(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'R',
                    codigo: res.codigo,
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

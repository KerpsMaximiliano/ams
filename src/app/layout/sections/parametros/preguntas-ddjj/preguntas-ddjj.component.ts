import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PreguntaDDJJService } from 'src/app/core/services/pregunta-ddjj.service';

// * Interfaces
import { IPreguntaDDJJ } from 'src/app/core/models/pregunta-ddjj.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditPreguntasDDJJDialogComponent } from './components/add-edit-preguntas-ddjj-dialog/add-edit-preguntas-ddjj-dialog.component';
import { PreguntasDDJJDashboardComponent } from './components/preguntas-ddjj-dashboard/preguntas-ddjj-dashboard.component';

@Component({
  selector: 'app-preguntas-ddjj',
  templateUrl: './preguntas-ddjj.component.html',
  styleUrls: ['./preguntas-ddjj.component.scss'],
})
export class PreguntasDDJJComponent {
  @ViewChild(PreguntasDDJJDashboardComponent)
  dashboard: PreguntasDDJJDashboardComponent;

  constructor(
    private preguntasDDJJService: PreguntaDDJJService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaPreguntasDDJJ(preguntasDDJJ?: IPreguntaDDJJ): void {
    const modalNuevaPreguntasDDJJ = this.dialog.open(
      AddEditPreguntasDDJJDialogComponent,
      {
        data: {
          title: `CREAR PREGUNTA DE DDJJ`,
          edit: true,
          par_modo: 'I',
          modelo_formulario: preguntasDDJJ?.modelo_formulario,
          nro_preg: 0,
          cantidad_lineas_resp: preguntasDDJJ?.cantidad_lineas_resp,
          pide_fecha: preguntasDDJJ?.pide_fecha,
          yes_no: preguntasDDJJ?.yes_no,
          primer_texto_preg: preguntasDDJJ?.primer_texto_preg,
          segundo_texto_preg: preguntasDDJJ?.segundo_texto_preg,
        },
      }
    );
    modalNuevaPreguntasDDJJ.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.preguntasDDJJService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Pregunta de DDJJ se ha creado exitosamente.',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión.', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
                    'error'
                  );
              this.nuevaPreguntasDDJJ(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'C',
                    modelo_formulario: '',
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

import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PreguntaDDJJService } from 'src/app/core/services/pregunta-ddjj.service';

// * Interfaces
import { IPreguntaDDJJ } from 'src/app/core/models/pregunta-ddjj.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditPreguntaDDJJDialogComponent } from './components/add-edit-pregunta-ddjj-dialog/add-edit-pregunta-ddjj-dialog.component';
import { PreguntaDDJJDashboardComponent } from './components/pregunta-ddjj-dashboard/pregunta-ddjj-dashboard.component';

@Component({
  selector: 'app-pregunta-ddjj',
  templateUrl: './pregunta-ddjj.component.html',
  styleUrls: ['./pregunta-ddjj.component.scss'],
})
export class PreguntaDDJJComponent {
  @ViewChild(PreguntaDDJJDashboardComponent)
  dashboard: PreguntaDDJJDashboardComponent;

  constructor(
    private preguntasDDJJService: PreguntaDDJJService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaPreguntaDDJJ(preguntaDDJJ?: IPreguntaDDJJ): void {
    const modalNuevaPreguntaDDJJ = this.dialog.open(
      AddEditPreguntaDDJJDialogComponent,
      {
        data: {
          title: `CREAR PREGUNTA DE DECLARACIÓN JURADA`,
          edit: true,
          par_modo: 'I',
          modelo_formulario: preguntaDDJJ?.modelo_formulario,
          nro_preg: 0,
          cantidad_lineas_resp: preguntaDDJJ?.cantidad_lineas_resp,
          pide_fecha: preguntaDDJJ?.pide_fecha,
          yes_no: preguntaDDJJ?.yes_no,
          primer_texto_preg: preguntaDDJJ?.primer_texto_preg,
          segundo_texto_preg: preguntaDDJJ?.segundo_texto_preg,
        },
      }
    );
    modalNuevaPreguntaDDJJ.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.preguntasDDJJService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La pregunta de declaración jurada se ha creado exitosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                    'error'
                  );
              this.nuevaPreguntaDDJJ(res);
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

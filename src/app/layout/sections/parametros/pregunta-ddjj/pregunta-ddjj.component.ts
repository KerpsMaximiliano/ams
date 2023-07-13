import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { PreguntaDDJJService } from 'src/app/core/services/pregunta-ddjj.service';

// * Interfaces
import { IPreguntaDDJJ } from 'src/app/core/models/pregunta-ddjj.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditPreguntaDDJJDialogComponent } from './components/add-edit-pregunta-ddjj-dialog/add-edit-pregunta-ddjj-dialog.component';

@Component({
  selector: 'app-pregunta-ddjj',
  templateUrl: './pregunta-ddjj.component.html',
  styleUrls: ['./pregunta-ddjj.component.scss'],
})
export class PreguntaDDJJComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IPreguntaDDJJ[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private preguntasDDJJService: PreguntaDDJJService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog(
      'CREAR PREGUNTAS DE DECLARACIONES JURADAS',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La pregunta de declaración jurada se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IPreguntaDDJJ): void {
    const dialogRef = this.openDialog(
      'EDITAR PREGUNTAS DE DECLARACIONES JURADAS',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La pregunta de declaración jurada se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IPreguntaDDJJ): void {
    this.openDialog('VER PREGUNTAS DE DECLARACIONES JURADAS', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.preguntasDDJJService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IPreguntaDDJJ[])
          : [res.dataset as IPreguntaDDJJ];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión.', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
        if (err.status == 404) this.dataSent = [];
      },
      complete: () => {
        this.utilService.closeLoading();
      },
    });
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    data?: IPreguntaDDJJ
  ): MatDialogRef<AddEditPreguntaDDJJDialogComponent, any> {
    return this.dialog.open(AddEditPreguntaDDJJDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        modelo_formulario: data?.modelo_formulario,
        nro_preg: data?.nro_preg,
        cantidad_lineas_resp: data?.cantidad_lineas_resp,
        pide_fecha: data?.pide_fecha,
        yes_no: data?.yes_no,
        primer_texto_preg: data?.primer_texto_preg,
        segundo_texto_preg: data?.segundo_texto_preg,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.preguntasDDJJService.CRUD(data).subscribe({
      next: (res: any) => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            modelo_formulario: res.dataset.modelo_formulario,
            nro_preg: res.dataset.nro_preg,
          })
        );
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión.', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';

// * Interfaces
import { IObraSocial } from 'src/app/core/models/obra-social.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditObraSocialDialogComponent } from './components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';

@Component({
  selector: 'app-obra-social',
  templateUrl: './obra-social.component.html',
  styleUrls: ['./obra-social.component.scss'],
})
export class ObraSocialComponent implements OnDestroy {
  public dataSent: IObraSocial[] = [];
  private dataSubscription: Subscription | undefined;

  constructor(
    private dataSharingService: DataSharingService,
    private obraSocialService: ObraSocialService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR OBRA SOCIAL', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La obra social se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IObraSocial): void {
    const dialogRef = this.openDialog('EDITAR OBRA SOCIAL', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La obra social se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IObraSocial): void {
    this.openDialog('VER OBRA SOCIAL', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.obraSocialService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IObraSocial[])
          : [res.dataset as IObraSocial];
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
    data?: IObraSocial
  ): MatDialogRef<AddEditObraSocialDialogComponent, any> {
    return this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo: data?.codigo,
        descripcion: data?.descripcion,
        propone_fecha_patologia: data?.propone_fecha_patologia,
        tipo_fecha_patologia: data?.tipo_fecha_patologia,
        tipo_obra_social_prepaga: data?.tipo_obra_social_prepaga,
        nro_registro: data?.nro_registro,
        similar_SMP: data?.similar_SMP,
        omite_R420: data?.omite_R420,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.obraSocialService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo: data.codigo,
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

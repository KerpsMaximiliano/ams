import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';

// * Interfaces
import { INacionalidad } from 'src/app/core/models/nacionalidad.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditNacionalidadDialogComponent } from './components/add-edit-nacionalidad-dialog/add-edit-nacionalidad-dialog.component';

@Component({
  selector: 'app-nacionalidad',
  templateUrl: './nacionalidad.component.html',
  styleUrls: ['./nacionalidad.component.scss'],
})
export class NacionalidadComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: INacionalidad[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private nacionalidadService: NacionalidadService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR NACIONALIDAD', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La nacionalidad se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: INacionalidad): void {
    const dialogRef = this.openDialog('EDITAR NACIONALIDAD', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La nacionalidad se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: INacionalidad): void {
    this.openDialog('VER NACIONALIDAD', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.nacionalidadService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as INacionalidad[])
          : [res.dataset as INacionalidad];
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
    data?: INacionalidad
  ): MatDialogRef<AddEditNacionalidadDialogComponent, any> {
    return this.dialog.open(AddEditNacionalidadDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo_nacionalidad_nuevo: data?.codigo_nacionalidad_nuevo,
        descripcion: data?.descripcion,
        codigo_sistema_anterior: data?.codigo_sistema_anterior,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.nacionalidadService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_nacionalidad_nuevo: data.codigo_nacionalidad_nuevo,
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

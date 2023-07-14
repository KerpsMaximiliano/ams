import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';

// * Interfaces
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Componentes
import { AddEditMotivoMovimientoDialogComponent } from './components/add-edit-motivo-movimiento-dialog/add-edit-motivo-movimiento-dialog.component';

@Component({
  selector: 'app-motivo-movimiento',
  templateUrl: './motivo-movimiento.component.html',
  styleUrls: ['./motivo-movimiento.component.scss'],
})
export class MotivoMovimientoComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IMotivoMovimiento[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private motivoMovimientoService: MotivoMovimientoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR MOTIVO DE MOVIMIENTO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El motivo de movimiento se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IMotivoMovimiento): void {
    const dialogRef = this.openDialog(
      'EDITAR MOTIVO DE MOVIMIENTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El motivo de movimiento se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IMotivoMovimiento): void {
    this.openDialog('VER MOTIVO DE MOVIMIENTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.motivoMovimientoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IMotivoMovimiento[])
          : [res.dataset as IMotivoMovimiento];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        if (err.status === 0) {
          this.utilService.notification('Error de conexión.', 'error');
        }
        if (err.status === 404) {
          this.dataSent = [];
        }
        if (err.status !== 0 && err.status !== 404) {
          this.utilService.notification(
            `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
            'error'
          );
        }
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
    data?: IMotivoMovimiento
  ): MatDialogRef<AddEditMotivoMovimientoDialogComponent, any> {
    return this.dialog.open(AddEditMotivoMovimientoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        id_motivo: data?.id_motivo,
        tipo_motivo: data?.tipo_motivo,
        descripcion: data?.descripcion,
        datos_adic_SN: data?.datos_adic_SN,
        fecha_inicio_vigencia: data?.fecha_inicio_vigencia,
        fecha_fin_vigencia: data?.fecha_fin_vigencia,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    const fecha =
      data.fecha_inicio_vigencia.toString().slice(0, 4) +
      '-' +
      data.fecha_inicio_vigencia.toString().slice(4, 6) +
      '-' +
      data.fecha_inicio_vigencia.toString().slice(6, 8);

    this.utilService.openLoading();
    this.motivoMovimientoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            tipo_motivo: data.tipo_motivo,
            id_motivo: data.id_motivo,
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
        data.fecha_inicio_vigencia = fecha;
      },
    });
  }
}

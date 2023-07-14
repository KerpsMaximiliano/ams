import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';

// * Interfaces
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditFormaPagoDialogComponent } from './components/add-edit-forma-pago-dialog/add-edit-forma-pago-dialog.component';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss'],
})
export class FormaPagoComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IFormaPago[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private formaPagoService: FormaPagoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR FORMA DE PAGO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La forma de pago se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IFormaPago): void {
    const dialogRef = this.openDialog('EDITAR FORMA DE PAGO', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La forma de pago se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IFormaPago): void {
    this.openDialog('VER FORMA DE PAGO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.formaPagoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IFormaPago[])
          : [res.dataset as IFormaPago];
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
    data?: IFormaPago
  ): MatDialogRef<AddEditFormaPagoDialogComponent, any> {
    return this.dialog.open(AddEditFormaPagoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo: data?.codigo,
        forma_pago: data?.forma_pago,
        description: data?.description,
        nombre_tarjeta_nemot: data?.nombre_tarjeta_nemot,
        codigo_banco: data?.codigo_banco,
        descripcion_banco: data?.descripcion_banco,
        trabaja_archivos: data?.trabaja_archivos,
        trabaja_rechazos: data?.trabaja_rechazos,
        solicita_datos_ad: data?.solicita_datos_ad,
        codigo_tarjeta_de_baja: data?.codigo_tarjeta_de_baja,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.formaPagoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            tipo_de_documento: data.tipo_de_documento,
            codigo: data.codigo,
            forma_pago: data.forma_pago,
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

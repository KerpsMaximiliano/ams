import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { MontoMinimoService } from 'src/app/core/services/monto-minimo.service';

// * Interfaces
import { IMontoMinimo } from 'src/app/core/models/monto-minimo.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditMontoMinimoComponent } from './components/add-edit-montos-minimo/add-edit-monto-minimo.component';

@Component({
  selector: 'app-monto-minimo',
  templateUrl: './monto-minimo.component.html',
  styleUrls: ['./monto-minimo.component.scss'],
})
export class MontoMinimoComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IMontoMinimo[];

  constructor(
    private dataSharingService: DataSharingService,
    private montoMinimoService: MontoMinimoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR MONTO MÍNIMO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El monto mínimo se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IMontoMinimo): void {
    const dialogRef = this.openDialog('EDITAR MONTO MÍNIMO', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El monto mínimo se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public delete(data: IMontoMinimo): void {
    const dialogRef = this.openDialog(
      'ELIMINAR EL MONTO MÍNIMO',
      'D',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El monto mínimo se ha eliminado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.montoMinimoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IMontoMinimo[])
          : [res.dataset as IMontoMinimo];
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
    data?: IMontoMinimo
  ): MatDialogRef<AddEditMontoMinimoComponent, any> {
    return this.dialog.open(AddEditMontoMinimoComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        actividad: data?.actividad,
        seccion: data?.seccion,
        fecha_vigencia: data?.fecha_vigencia,
        importe_minimo: data?.importe_minimo,
        movimiento: data?.movimiento,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.montoMinimoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        if (data.par_modo === 'C' || data.par_modo === 'U') {
          this.getData(
            JSON.stringify({
              par_modo: 'R',
              actividad: data?.actividad,
              seccion: data?.seccion,
              fecha_vigencia: data?.fecha_vigencia,
            })
          );
        } else {
          if (data.par_modo === 'D') {
            this.getData(
              JSON.stringify({
                par_modo: 'O',
                actividad: data?.actividad,
              })
            );
          }
        }
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
      complete: () => {
        this.utilService.closeLoading();
      },
    });
  }
}

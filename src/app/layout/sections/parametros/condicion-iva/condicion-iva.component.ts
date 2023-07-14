import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { CondicionIvaService } from 'src/app/core/services/condicion-iva.service';
import { UtilService } from 'src/app/core/services/util.service';

// * Interfaces
import { ICondicionIva } from 'src/app/core/models/condicion-iva.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Componentes
import { AddEditCondicionIvaDialogComponent } from './components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';

@Component({
  selector: 'app-condicion-iva-documento',
  templateUrl: './condicion-iva.component.html',
  styleUrls: ['./condicion-iva.component.scss'],
})
export class CondicionIvaComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: ICondicionIva[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private condicionIvaService: CondicionIvaService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR CONDICIÓN DE IVA', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La condición de IVA se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: ICondicionIva): void {
    const dialogRef = this.openDialog(
      'EDITAR CONDICIÓN DE IVA',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La condición de IVA se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: ICondicionIva): void {
    this.openDialog('VER CONDICIÓN DE IVA', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.condicionIvaService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as ICondicionIva[])
          : [res.dataset as ICondicionIva];
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
    data?: ICondicionIva
  ): MatDialogRef<AddEditCondicionIvaDialogComponent, any> {
    return this.dialog.open(AddEditCondicionIvaDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo_de_IVA: data?.codigo_de_IVA,
        descripcion: data?.descripcion,
        descripcion_reducida: data?.descripcion_reducida,
        formulario_AB: data?.formulario_AB,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.condicionIvaService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_de_IVA: data.codigo_de_IVA,
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

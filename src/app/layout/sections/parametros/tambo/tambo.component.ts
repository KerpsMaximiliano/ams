import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { TamboService } from 'src/app/core/services/tambo.service';

// * Interfaces
import { ITambo } from 'src/app/core/models/tambo.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditLocalidadDialogComponent } from './components/add-edit-tambo-dialog/add-edit-tambo-dialog.component';

@Component({
  selector: 'app-tambo',
  templateUrl: './tambo.component.html',
  styleUrls: ['./tambo.component.scss'],
})
export class TamboComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;

  public dataSent: ITambo[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private tamboService: TamboService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR TAMBO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(res, 'El tambo se ha creado exitosamente.', dialogRef);
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: ITambo): void {
    const dialogRef = this.openDialog('EDITAR TAMBO', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El tambo se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: ITambo): void {
    this.openDialog('VER TAMBO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.tamboService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as ITambo[])
          : [res.dataset as ITambo];
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
    data?: ITambo
  ): MatDialogRef<AddEditLocalidadDialogComponent, any> {
    return this.dialog.open(AddEditLocalidadDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        id_empresa: data?.id_empresa,
        razon_social: data?.razon_social,
        grasa_ent: data?.grasa_ent,
        fecha_suspension: data?.fecha_suspension,
        fecha_rehabilitacion: data?.fecha_rehabilitacion,
        localidad: data?.localidad,
        provincia: data?.provincia,
        emp_vinc_ent: data?.emp_vinc_ent,
        ent_sancor: data?.ent_sancor,
        canal: data?.canal,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.tamboService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            id_empresa: data?.id_empresa,
            id_tambos: data?.id_tambos,
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

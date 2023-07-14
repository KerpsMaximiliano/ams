import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { EstadoCivilService } from 'src/app/core/services/estado-civil.service';

// * Interfaces
import { IEstadoCivil } from 'src/app/core/models/estado-civil.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditEstadoCivilDialogComponent } from './components/add-edit-estado-civil-dialog/add-edit-estado-civil-dialog.component';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.scss'],
})
export class EstadoCivilComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IEstadoCivil[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private estadoCivilService: EstadoCivilService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR ESTADO CIVIL', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El estado civil se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IEstadoCivil): void {
    const dialogRef = this.openDialog('EDITAR ESTADO CIVIL', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El estado civil se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IEstadoCivil): void {
    this.openDialog('VER ESTADO CIVIL', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.estadoCivilService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IEstadoCivil[])
          : [res.dataset as IEstadoCivil];
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
    data?: IEstadoCivil
  ): MatDialogRef<AddEditEstadoCivilDialogComponent, any> {
    return this.dialog.open(AddEditEstadoCivilDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo_estado_civil: data?.codigo_estado_civil,
        description: data?.description,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.estadoCivilService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_estado_civil: data.codigo_estado_civil,
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

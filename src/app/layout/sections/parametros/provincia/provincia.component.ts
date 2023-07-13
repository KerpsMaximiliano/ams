import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditProvinciaDialogComponent } from './components/add-edit-provincia-dialog/add-edit-provincia-dialog.component';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.scss'],
})
export class ProvinciaComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IProvincia[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private provinciaService: ProvinciaService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR PROVINCIA', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La provincia se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IProvincia): void {
    const dialogRef = this.openDialog('EDITAR PROVINCIA', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La provincia se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IProvincia): void {
    this.openDialog('VER PROVINCIA', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.provinciaService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IProvincia[])
          : [res.dataset as IProvincia];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
        ? this.utilService.notification('Error de conexión.', 'error')
        : JSON.parse(value).par_modo !== 'O' ? this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
              ) : ''
              if (err.status == 404) this.dataSent = [];
            },
      complete: () => {
        this.utilService.closeLoading();
        if(JSON.parse(value).nombre_provincia.trim() === "" || JSON.parse(value).nombre_provincia === undefined) {
          this.provinciaService.setProvincias(this.dataSent)
        }
      },
    });
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    data?: IProvincia
  ): MatDialogRef<AddEditProvinciaDialogComponent, any> {
    return this.dialog.open(AddEditProvinciaDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo: data?.codigo,
        nombre_provincia: data?.nombre_provincia,
        codifica_altura: data?.codifica_altura,
        codigo_provincia: data?.codigo_provincia,
        flete_transportista: data?.flete_transportista,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.provinciaService.CRUD(data).subscribe({
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

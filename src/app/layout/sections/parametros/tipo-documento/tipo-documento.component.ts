import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { TipoDocumentoService } from 'src/app/core/services/tipo-documento.service';

// * Interfaces
import { ITipoDocumento } from 'src/app/core/models/tipo-documento.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditTipoDocumentoDialogComponent } from './components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss'],
})
export class TipoDocumentoComponent implements OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: ITipoDocumento[] = [];

  constructor(
    private dataSharingService: DataSharingService,
    private tipoDocumentoService: TipoDocumentoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR TIPO DE DOCUMENTO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El documento se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: ITipoDocumento): void {
    const dialogRef = this.openDialog(
      'EDITAR TIPO DE DOCUMENTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El tipo de documento se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: ITipoDocumento): void {
    this.openDialog('VER TIPO DE DOCUMENTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.tipoDocumentoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as ITipoDocumento[])
          : [res.dataset as ITipoDocumento];
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
    data?: ITipoDocumento
  ): MatDialogRef<AddEditTipoDocumentoDialogComponent, any> {
    return this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        tipo_de_documento: data?.tipo_de_documento,
        descripcion: data?.descripcion,
        descripcion_reducida: data?.descripcion_reducida,
        control_cuit: data?.control_cuit,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.tipoDocumentoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            tipo_de_documento: data.tipo_de_documento,
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

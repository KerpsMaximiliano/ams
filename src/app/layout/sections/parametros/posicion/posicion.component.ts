import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { PosicionService } from 'src/app/core/services/posicion.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IPosicion } from 'src/app/core/models/posicion.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditPosicionDialogComponent } from './add-edit-posicion-dialog/add-edit-posicion-dialog.component';

@Component({
  selector: 'app-posicion',
  templateUrl: './posicion.component.html',
  styleUrls: ['./posicion.component.scss'],
})
export class PosicionComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public provincias: IProvincia[];
  public dataSent: IPosicion[];
  public request: boolean = false;

  constructor(
    private dataSharingService: DataSharingService,
    private provinciaService: ProvinciaService,
    private posicionService: PosicionService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProvincias();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR POSICIÓN', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La posición se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IPosicion): void {
    const dialogRef = this.openDialog('EDITAR POSICIÓN', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La posición se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IPosicion): void {
    this.openDialog('VER POSICIÓN', 'R', false, data);
  }

  public getPosicion(value: string): void {
    this.utilService.openLoading();
    this.posicionService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IPosicion[])
          : [res.dataset as IPosicion];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        if (err.status == 0) {
          this.utilService.notification('Error de conexión.', 'error');
        } else {
          this.utilService.notification(
            `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
            'error'
          );
        }
        if (err.status == 404) {
          this.dataSent = [];
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
    data?: IPosicion
  ): MatDialogRef<AddEditPosicionDialogComponent, any> {
    return this.dialog.open(AddEditPosicionDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        provincias: this.provincias,
        codigo_posicion: data?.codigo_posicion,
        descripcion: data?.descripcion,
        domicilio: data?.domicilio,
        codigo_postal: data?.codigo_postal,
        sub_codigo_postal: data?.sub_codigo_postal,
        control_rechazo: data?.control_rechazo,
        yes_no: data?.yes_no,
        fecha_vigencia: data?.fecha_vigencia,
        letra_provincia: data?.letra_provincia,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.posicionService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getPosicion(
          JSON.stringify({
            par_modo: 'R',
            codigo_posicion: data.codigo_posicion,
          })
        );
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        if (err.status === 0) {
          this.utilService.notification('Error de conexión.', 'error');
        } else {
          this.utilService.notification(
            `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
            'error'
          );
        }
      },
    });
  }

  private getProvincias(): void {
    this.utilService.openLoading();
    this.provinciaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          nombre_provincia: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.provincias = Array.isArray(res.dataset)
            ? (res.dataset as IProvincia[])
            : [res.dataset as IProvincia];
          this.request = true;
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
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
}

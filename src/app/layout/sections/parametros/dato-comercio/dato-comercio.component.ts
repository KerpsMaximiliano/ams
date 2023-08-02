import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DatoComercioService } from 'src/app/core/services/dato-comercio.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

// * Interfaces
import {
  IDatoComercio,
  IFiltroDatoComercio,
  ITipoFormaPago,
} from 'src/app/core/models/dato-comercio.interface';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditDatoComercioDialogComponent } from './components/add-edit-producto-dialog/add-edit-dato-comercio-dialog.component';

@Component({
  selector: 'app-dato-comercio',
  templateUrl: './dato-comercio.component.html',
  styleUrls: ['./dato-comercio.component.scss'],
})
export class DatoComercioComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public empresaFactura: IEmpresaFactura;
  public formasPago: ITipoFormaPago[];
  public isLoadingFormaPago: boolean = false;
  public loadingError: boolean = false;
  public dataSent?: IDatoComercio[];

  constructor(
    private dataSharingService: DataSharingService,
    private datoComercioService: DatoComercioService,
    private empresaFacturaService: EmpresaFacturaService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* Verifica que previamente se haya seleccionado una empresa */
    if (this.empresaFacturaService.get()) {
      this.empresaFactura = this.empresaFacturaService.get()[0];
    } else {
      this.router.navigate(['parametros/empresa-factura']);
    }

    // Seteo de formas de pago (utilizados en el filtro)
    if (this.datoComercioService.getFormasPago()) {
      this.formasPago = this.datoComercioService.getFormasPago();
      this.loadingError = false;
      this.isLoadingFormaPago = false;
    } else {
      this.getFormasPago();
    }
  }

  ngAfterViewInit(): void {
    this.utilService.closeLoading();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR DATO DE COMERCIO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El dato de comercio se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IDatoComercio): void {
    const dialogRef = this.openDialog(
      'EDITAR DATO DE COMERCIO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El dato de comercio se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public delete(data: IDatoComercio): void {
    const dialogRef = this.openDialog(
      'ELIMINAR DATO COMERCIO',
      'D',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El dato de comercio se ha eliminado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  private getData(value: string): void {
    this.utilService.openLoading();
    this.datoComercioService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IDatoComercio[])
          : [res.dataset as IDatoComercio];
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

  public back(): void {
    this.utilService.openLoading();
    this.empresaFacturaService.setBack(true);
    this.router.navigate(['parametros/empresa-factura']);
    return;
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    data?: IDatoComercio
  ): MatDialogRef<AddEditDatoComercioDialogComponent, any> {
    return this.dialog.open(AddEditDatoComercioDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        formas_pago: this.formasPago,
        empresa_factura: this.empresaFactura,
        id_empresa: data?.id_empresa,
        forma_pago: data?.forma_pago,
        codigo_tarjeta: data?.codigo_tarjeta,
        nro_comercio: data?.nro_comercio,
        codigo_servicio: data?.codigo_servicio,
        nro_caja: data?.nro_caja,
        id_banco: data?.id_banco,
        nro_suc: data?.nro_suc,
        car_dest: data?.car_dest,
        prg_gen: data?.prg_gen,
        forma_pago_descripcion: data?.forma_pago_descripcion,
        banco_descripcion: data?.banco_descripcion,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.datoComercioService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        if (data.par_modo === 'C' || data.par_modo === 'U') {
          this.getData(
            JSON.stringify({
              par_modo: 'O',
              id_empresa: this.empresaFactura.id_empresa,
              forma_pago: data?.forma_pago,
              codigo_tarjeta: data?.codigo_tarjeta,
            })
          );
        } else {
          if (data.par_modo === 'D') {
            this.getData(
              JSON.stringify({
                par_modo: 'O',
                id_empresa: this.empresaFactura.id_empresa,
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
    });
  }

  private getFormasPago(): void {
    this.utilService.openLoading();
    this.loadingError = false;
    this.isLoadingFormaPago = true;
    this.datoComercioService
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.formasPago = Array.isArray(res.dataset)
            ? (res.dataset as ITipoFormaPago[])
            : [res.dataset as ITipoFormaPago];
          this.isLoadingFormaPago = false;
          this.loadingError ||= false;
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
            this.loadingError = true;
          } else if (err.status === 404) {
            this.formasPago = [];
            this.loadingError ||= false;
            this.isLoadingFormaPago = false;
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
            this.loadingError = true;
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  public search(filtro: IFiltroDatoComercio) {
    this.getData(
      JSON.stringify({
        par_modo: 'O',
        id_empresa: filtro.empresaFactura?.id_empresa,
        forma_pago: filtro.formaPago?.id_forma_pago,
        codigo_tarjeta: filtro.tarjeta?.codigo,
      })
    );
  }
}

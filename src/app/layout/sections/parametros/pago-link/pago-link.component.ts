import { Component, OnInit } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { PagoLinkService } from 'src/app/core/services/pago-link.service';

// * Interfaces
import { IPagoLink } from 'src/app/core/models/pago-link.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditPagoLinkDialogComponent } from './components/add-edit-pago-link-dialog/add-edit-pago-link-dialog.component';
import { IListFormaPago } from 'src/app/core/models/dato-comercio.interface';
import { DatoComercioService } from 'src/app/core/services/dato-comercio.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';
import { Router } from '@angular/router';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

@Component({
  selector: 'app-pago-link',
  templateUrl: './pago-link.component.html',
  styleUrls: ['./pago-link.component.scss'],
})
export class PagoLinkComponent {
  public empresaFactura: IEmpresaFactura;
  public descripcion: string;
  public formasPago: IListFormaPago;
  public dataSent: IPagoLink[] = [];

  constructor(
    private empresaFacturaService: EmpresaFacturaService,
    private pagoLinkService: PagoLinkService,
    private datosComercioService: DatoComercioService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.empresaFacturaService.get()) {
      this.router.navigate(['parametros/empresa-factura']);
      return;
    } else {
      this.empresaFactura = this.empresaFacturaService.get()[0];
      this.getpagos();
    }
  }

  public back(): void {
    this.utilService.openLoading();
    this.empresaFacturaService.setBack(true);
    this.router.navigate(['parametros/empresa-factura']);
    return;
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR PAGO LINK', 'C', true);
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(
        res,
        'El pago link se ha creado exitosamente.',
        dialogRef
      );
    });
  }

  public delet(data: IPagoLink): void {
    const dialogRef = this.openDialog('ELIMINAR PAGO LINK', 'D', true, data);
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(
        res,
        'El pago link se ha eliminado exitosamente.',
        dialogRef
      );
    });
  }

  getpagos() {
    this.utilService.openLoading();
    this.datosComercioService
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.formasPago = Array.isArray(res.dataset)
            ? res.dataset
            : [res.dataset];
        },
        error: (err: any) => {
          this.utilService.closeLoading();
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  public getPagoLink(value: string): void {
    this.utilService.openLoading();
    this.pagoLinkService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IPagoLink[])
          : [res.dataset as IPagoLink];
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
          if (err.status == 404) this.dataSent = [];
        }
        this.dataSent = [];
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
    pagoLink?: IPagoLink
  ): MatDialogRef<AddEditPagoLinkDialogComponent, any> {
    return this.dialog.open(AddEditPagoLinkDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        empresa_factura: this.empresaFactura.id_empresa,
        empresa_factura_descripcion: this.empresaFactura.descripcion,
        codigo_forma_pago: pagoLink?.codigo_forma_pago,
        formasPago: this.formasPago,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    if (data) {
      this.utilService.openLoading();
      this.pagoLinkService.CRUD(data).subscribe({
        next: (res) => {
          this.utilService.notification(successMessage, 'success');
          this.getPagoLink(
            JSON.stringify({
              par_modo: 'R',
              empresa_factura: data.empresa_factura,
              codigo_forma_pago: data.codigo_forma_pago,
            })
          );
          dialogRef.close();
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

  public filter(data: string): void {
    this.getPagoLink(data);
  }
}

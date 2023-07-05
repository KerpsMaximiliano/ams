import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { UnificacionAporteProductoService } from 'src/app/core/services/unificacion-aporte-producto.service';

// * Interfaces
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditUnificacionAporteProductoComponent } from './components/add-edit-unificacion-aporte-producto/add-edit-unificacion-aporte-producto.component';

@Component({
  selector: 'app-unificacion-aporte-producto',
  templateUrl: './unificacion-aporte-producto.component.html',
  styleUrls: ['./unificacion-aporte-producto.component.scss'],
})
export class UnificacionAporteProductoComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IUnificacionAporteProducto[];

  producto: any;

  constructor(
    private dataSharingService: DataSharingService,
    private unificacionAporteProductoService: UnificacionAporteProductoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {
    this.producto = this.unificacionAporteProductoService.get();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.utilService.closeLoading();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog(
      'CREAR UNIFICACIÓN DE APORTE POR PRODUCTO',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'La unificación de aporte por producto se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IUnificacionAporteProducto): void {
    const dialogRef = this.openDialog(
      'EDITAR UNIFICACION DE APORTE POR PRODUCTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'La unificación de aporte por producto se ha editado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IUnificacionAporteProducto): void {
    this.openDialog('VER UNIFICACIÓN DE APORTE POR PRODUCTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.unificacionAporteProductoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IUnificacionAporteProducto[])
          : [res.dataset as IUnificacionAporteProducto];
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
    data?: IUnificacionAporteProducto
  ): MatDialogRef<AddEditUnificacionAporteProductoComponent, any> {
    return this.dialog.open(AddEditUnificacionAporteProductoComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        producto_principal_cod: this.producto?.codigo_producto,
        producto_principal: this.producto?.descripcion_producto,
        subproducto_principal_cod: this.producto?.codigo_producto_sub,
        subproducto_principal: this.producto?.descripcion_producto_sub,
        producto_secundario: data?.producto_secundario,
        producto_secundario_cod: data?.producto_secundario_cod,
        subproducto_secundario: data?.subproducto_secundario,
        subproducto_secundario_cod: data?.subproducto_secundario_cod,
        unifica_aporte: 'S',
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.unificacionAporteProductoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            producto_principal_cod: this.producto?.codigo_producto,
            subproducto_principal_cod: this.producto?.codigo_producto_sub,
            producto_secundario_cod: data?.producto_secundario_cod,
            subproducto_secundario_cod: data?.subproducto_secundario_cod,
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

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { UnificacionAporteProductoService } from 'src/app/core/services/unificacion-aporte-producto.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditUnificacionAporteProductoComponent } from './components/add-edit-unificacion-aporte-producto/add-edit-unificacion-aporte-producto.component';

@Component({
  selector: 'app-unificacion-aporte-producto',
  templateUrl: './unificacion-aporte-producto.component.html',
  styleUrls: ['./unificacion-aporte-producto.component.scss'],
})
export class UnificacionAporteProductoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private dataSubscription: Subscription | undefined;
  public dataSent: IUnificacionAporteProducto[];

  public producto: IProducto;

  constructor(
    private dataSharingService: DataSharingService,
    private unificacionAporteProductoService: UnificacionAporteProductoService,
    private productoService: ProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.producto = this.productoService.get();
  }

  ngOnInit(): void {
    if (!this.producto) {
      this.router.navigate(['parametros/productos']);
      return;
    }
    this.dataSent = this.unificacionAporteProductoService.get();
  }

  ngAfterViewInit(): void {
    this.utilService.closeLoading();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public back(): void {
    this.utilService.openLoading();
    this.productoService.setBack(true);
    this.router.navigate(['parametros/productos']);
    return;
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

  public delete(data: IUnificacionAporteProducto): void {
    const dialogRef = this.openDialog(
      'ELIMINAR LA UNIFICACIÓN DE APORTE POR PRODUCTO',
      'D',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'La unificación de aporte por producto se ha eliminado exitosamente. ',
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
    this.unificacionAporteProductoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IUnificacionAporteProducto[])
          : [res.dataset as IUnificacionAporteProducto];
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
    data?: IUnificacionAporteProducto
  ): MatDialogRef<AddEditUnificacionAporteProductoComponent, any> {
    let producto_principal: number;
    let subproducto_principal: number;
    let producto_principal_descripcion: string | '';
    let subproducto_principal_descripcion: string | '';

    producto_principal = this.producto.producto_administrador
      ? this.producto.producto_administrador
      : this.producto.codigo_producto
      ? this.producto.codigo_producto
      : 0;

    subproducto_principal =
      this.producto.producto_administrador && this.producto.codigo_producto
        ? this.producto.codigo_producto
        : 0;

    producto_principal_descripcion = this.producto
      .descripcion_producto_administrador
      ? this.producto.descripcion_producto_administrador.trim()
      : this.producto.descripcion_producto
      ? this.producto.descripcion_producto.trim()
      : '';

    subproducto_principal_descripcion = this.producto
      .descripcion_producto_administrador
      ? this.producto.descripcion_producto
        ? this.producto.descripcion_producto.trim()
        : ''
      : '';

    return this.dialog.open(AddEditUnificacionAporteProductoComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        producto_principal: producto_principal,
        producto_principal_descripcion: producto_principal_descripcion,
        subproducto_principal: subproducto_principal,
        subproducto_principal_descripcion: subproducto_principal_descripcion,
        producto_secundario: data?.producto_secundario,
        producto_secundario_descripcion: data?.producto_principal_descripcion,
        subproducto_secundario: data?.subproducto_secundario,
        subproducto_secundario_descripcion:
          data?.subproducto_principal_descripcion,
        unifica_aportes: data?.unifica_aportes,
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
        if (data.par_modo === 'C') {
          this.getData(
            JSON.stringify({
              par_modo: 'R',
              producto_principal: data?.producto_principal,
              subproducto_principal: data?.subproducto_principal,
              producto_secundario: data?.producto_secundario,
              subproducto_secundario: data?.subproducto_secundario,
            })
          );
        } else {
          if (data.par_modo === 'D') {
            this.getData(
              JSON.stringify({
                par_modo: 'O',
                producto_principal: data?.producto_principal,
                subproducto_principal: data?.subproducto_principal,
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

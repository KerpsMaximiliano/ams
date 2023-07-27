import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditProductoDialogComponent } from './components/add-edit-producto-dialog/add-edit-producto-dialog.component';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public isLoadingEmpresaFactura: boolean = false;
  public isLoadingError: boolean;
  public empresaFactura: IEmpresaFactura[];
  public dataSent: IProducto[];

  constructor(
    private dataSharingService: DataSharingService,
    private productoService: ProductoService,
    private empresaFacturaService: EmpresaFacturaService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productoService.setRoute(true);
    if (this.productoService.getRoute() && this.productoService.getBack()) {
      if (this.productoService.get()) {
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_producto: this.productoService.get().codigo_producto,
          })
        );
        this.edit(this.productoService.get());
      }
    }

    if (this.empresaFacturaService.get()) {
      this.empresaFactura = this.empresaFacturaService.get();
      this.isLoadingError = false;
      this.isLoadingEmpresaFactura = true;
    } else {
      this.getEmpresas();
    }
  }

  ngAfterViewInit(): void {
    this.utilService.closeLoading();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.productoService.setBack(false);
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR PRODUCTO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El producto se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IProducto): void {
    const dialogRef = this.openDialog('EDITAR PRODUCTO', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res: any) => {
        this.performCRUD(
          res,
          'El producto se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IProducto): void {
    this.openDialog('VER PRODUCTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.productoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IProducto[])
          : [res.dataset as IProducto];
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
    data?: IProducto
  ): MatDialogRef<AddEditProductoDialogComponent, any> {
    return this.dialog.open(AddEditProductoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        empresaFactura: this.empresaFactura,
        codigo_producto: data?.codigo_producto,
        descripcion_producto: data?.descripcion_producto,
        descripcion_reducida: data?.descripcion_reducida,
        clase_producto: data?.clase_producto,
        tipo_producto: data?.tipo_producto,
        codigo_fuente_ingreso: data?.codigo_fuente_ingreso,
        numero_empresa_factura: data?.numero_empresa_factura,
        fecha_baja_producto: data?.fecha_baja_producto
          ? data?.fecha_baja_producto
          : 0,
        codigo_obra_social: data?.codigo_obra_social,
        producto_administrador: data?.producto_administrador,
        // * Datos sin resolución.
        subprograma_afiliacion: '',
        subprograma_parametros: '',
        subprograma_calculo_valores: '',
        subprograma_calculo_comisiones: '',
        factura_primera: '',
        factura_segunda: '',
        factura_tercera: '',
        dia_vencimiento: 1,
        tipo_capita: 'P',
        capita_empresa: 'N',
        fecha_bon_perm: 'P',
        solicita_forma_pago: 'N',
        calcula_fecha_inicio_servicio: 'N',
        tipo_producto_vol_obl: 'P',
        subsidio_corporativo: 'N',
        requiere_nro_form_sss: 'N',
        periodo_generacion_factura: 0,
        periodo_a_evaluar: 0,
        ultimo_periodo_liquidado: 0,
        programa_recalculo: '',
        clasificador: 'D',
        // * Datos adicionales para el modal (view | edit).
        descripcion_producto_administrador:
          data?.descripcion_producto_administrador,
        descripcion_obra_social: data?.descripcion_obra_social,
        descripcion_fuente_ingreso: data?.descripcion_fuente_ingreso,
        descripcion_empresa: data?.descripcion_empresa,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.productoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_producto: data.codigo_producto,
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

  private getEmpresas(): void {
    this.utilService.openLoading();
    this.empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.empresaFactura = Array.isArray(res.dataset)
            ? (res.dataset as IEmpresaFactura[])
            : [res.dataset as IEmpresaFactura];
          this.isLoadingEmpresaFactura = true;
          this.isLoadingError = false;
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
          }
          if (err.status === 404) {
            this.empresaFactura = [];
          }
          if (err.status !== 0 && err.status !== 404) {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
          }
          this.isLoadingError = true;
        },
        complete: () => {
          this.empresaFacturaService.set(this.empresaFactura);
          this.utilService.closeLoading();
        },
      });
  }
}

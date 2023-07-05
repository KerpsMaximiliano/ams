import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SubMotivoMovimientoProductoService } from 'src/app/core/services/sub-motivo-movimiento-producto.service';
import { MotivoMovimientoProductoService } from 'src/app/core/services/motivo-movimiento-producto.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { ISubMotivoMovimientoProducto } from 'src/app/core/models/sub-motivo-movimiento.interface';
import { IMotivoMovimientoProducto } from 'src/app/core/models/motivo-movimiento-producto.interface';
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditSubMotivoMovimientoProductoDialogComponent } from './components/add-edit-sub-motivo-movimiento-producto-dialog/add-edit-sub-motivo-movimiento-producto-dialog.component';

@Component({
  selector: 'app-sub-motivo-movimiento-producto',
  templateUrl: './sub-motivo-movimiento-producto.component.html',
  styleUrls: ['./sub-motivo-movimiento-producto.component.scss'],
})
export class SubMotivoMovimientoProductoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  private producto: IProducto;
  public motivoMovimientoProducto: IMotivoMovimientoProducto;
  public dataSent: ISubMotivoMovimientoProducto[];

  constructor(
    private dataSharingService: DataSharingService,
    private subMotivoMovimientoProductoService: SubMotivoMovimientoProductoService,
    private motivoMovimientoProductoService: MotivoMovimientoProductoService,
    private productoService: ProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.motivoMovimientoProducto = this.motivoMovimientoProductoService.get();
    this.producto = this.productoService.get();
  }

  ngOnInit(): void {
    if (!this.motivoMovimientoProducto) {
      this.router.navigate(['parametros/movimiento-producto']);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public back(): void {
    this.utilService.openLoading();
    this.router.navigate(['parametros/motivo-movimiento-producto']);
    return;
  }

  public new(): void {
    const dialogRef = this.openDialog(
      'CREAR SUBMOTIVO DE MOVIMIENTO',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El submotivo de movimiento se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: ISubMotivoMovimientoProducto): void {
    const dialogRef = this.openDialog(
      'EDITAR SUBMOTIVO DE MOVIMIENTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El submotivo se ha editado extiosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: ISubMotivoMovimientoProducto): void {
    this.openDialog('VER SUBMOTIVO DE MOVIMIENTO', 'R', false, data);
  }

  public getSubMotivoMovimiento(value: string): void {
    this.utilService.openLoading();
    this.subMotivoMovimientoProductoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as ISubMotivoMovimientoProducto[])
          : [res.dataset as ISubMotivoMovimientoProducto];
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
    data?: ISubMotivoMovimientoProducto
  ): MatDialogRef<AddEditSubMotivoMovimientoProductoDialogComponent, any> {
    return this.dialog.open(AddEditSubMotivoMovimientoProductoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        movimiento: this.motivoMovimientoProducto,
        codigo_motivo: this.motivoMovimientoProducto.codigo_motivo,
        codigo_producto: this.motivoMovimientoProducto.id_producto,
        producto: this.producto.descripcion_producto,
        codigo_submotivo: data?.codigo_submotivo,
        descripcion: data?.descripcion,
        fecha_vigencia: data?.fecha_vigencia ? data?.fecha_vigencia : 0,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.subMotivoMovimientoProductoService.CRUD(data).subscribe({
      next: (res: any) => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getSubMotivoMovimiento(
          JSON.stringify({
            par_modo: 'R',
            movimiento: this.motivoMovimientoProducto.tipo_motivo,
            codigo_motivo: this.motivoMovimientoProducto.codigo_motivo,
            producto: this.motivoMovimientoProducto.id_producto,
            codigo_submotivo: res?.dataset.codigo_submotivo,
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

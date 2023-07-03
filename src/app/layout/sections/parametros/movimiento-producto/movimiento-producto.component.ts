import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';
import { MovimientoProductoService } from 'src/app/core/services/movimiento-producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';
import { IMovimientoProducto } from 'src/app/core/models/movimiento-producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Componentes
import { AddEditMovimientoProductoDialogComponent } from './components/add-edit-movimiento-producto-dialog/add-edit-movimiento-producto-dialog.component';

@Component({
  selector: 'app-movimiento-producto',
  templateUrl: './movimiento-producto.component.html',
  styleUrls: ['./movimiento-producto.component.scss'],
})
export class MovimientoProductoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IMovimientoProducto[];
  public producto: IProducto;

  constructor(
    private dataSharingService: DataSharingService,
    private productoService: ProductoService,
    private movimientoProductoService: MovimientoProductoService,
    private utilService: UtilService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.producto = this.productoService.get();
  }

  ngOnInit(): void {
    if (!this.producto) {
      this.router.navigate(['parametros/productos']);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog(
      'CREAR MOTIVO DE MOVIMIENTO POR PRODUCTO',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El motivo de movimiento por producto se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IMovimientoProducto): void {
    const dialogRef = this.openDialog(
      'EDITAR MOTIVO DE MOVIMIENTO POR PRODUCTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El motivo de movimiento por producto se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IMovimientoProducto): void {
    this.openDialog('VER MOTIVO DE MOVIMIENTO POR PRODUCTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.movimientoProductoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IMovimientoProducto[])
          : [res.dataset as IMovimientoProducto];
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
    data?: IMovimientoProducto
  ): MatDialogRef<AddEditMovimientoProductoDialogComponent, any> {
    return this.dialog.open(AddEditMovimientoProductoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        producto: this.producto,
        id_producto: data?.id_producto,
        codigo_motivo: data?.codigo_motivo,
        tipo_motivo: data?.tipo_motivo,
        descripcion: data?.descripcion,
        datos_adicionales: data?.datos_adicionales,
        otra_cobertura: data?.otra_cobertura,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.movimientoProductoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            id_producto: data.id_producto,
            codigo_motivo: data.codigo_motivo,
            tipo_motivo: data.tipo_motivo[0],
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
}

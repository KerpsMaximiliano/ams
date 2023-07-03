import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';
import { ParentescoProductoService } from 'src/app/core/services/parentesco-producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';
import {
  IParentesco,
  IParentescoProducto,
} from 'src/app/core/models/parentesco-producto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Componentes
import { AddEditParentescoProductoDialogComponent } from './components/add-edit-parentesco-producto-dialog/add-edit-parentesco-producto-dialog.component';

@Component({
  selector: 'app-parentesco-producto',
  templateUrl: './parentesco-producto.component.html',
  styleUrls: ['./parentesco-producto.component.scss'],
})
export class ParentescoProductoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IParentescoProducto[];
  public parentescos: IParentesco[];
  public producto: IProducto;

  constructor(
    private dataSharingService: DataSharingService,
    private productoService: ProductoService,
    private parentescoProductoService: ParentescoProductoService,
    private utilService: UtilService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.producto = this.productoService.get();
    this.parentescos = this.parentescoProductoService.get();
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
      'CREAR PARENTESCO POR PRODUCTO',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El parentesco se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IParentescoProducto): void {
    const dialogRef = this.openDialog(
      'EDITAR PARENTESCO POR PRODUCTO',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El parentesco por producto se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IParentescoProducto): void {
    this.openDialog('VER PARENTESCO POR PRODUCTO', 'R', false, data);
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.parentescoProductoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IParentescoProducto[])
          : [res.dataset as IParentescoProducto];
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
    data?: IParentescoProducto
  ): MatDialogRef<AddEditParentescoProductoDialogComponent, any> {
    return this.dialog.open(AddEditParentescoProductoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        producto: this.producto,
        parentescos: this.parentescos,
        codigo_parentesco: data?.codigo_parentesco,
        descripcion: data?.descripcion,
        permite_darse_baja: data?.permite_darse_baja,
        pide_fecha_enlace: data?.pide_fecha_enlace,
        codigo_parentesco_afip: data?.codigo_afip,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.parentescoProductoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_parentesco: data.codigo_parentesco,
            producto: this.producto.codigo_producto,
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

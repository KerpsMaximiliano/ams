import { Component, Inject } from '@angular/core';


// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  getErrorMessage,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { SetProductoDialogComponent } from './set-producto-dialog/set-producto-dialog.component';
import { UtilService } from 'src/app/core/services/util.service';
import { IProductoAdministrador } from 'src/app/core/models/producto-administrador.interface';

@Component({
  selector: 'app-add-edit-unificacion-aporte-producto',
  templateUrl: './add-edit-unificacion-aporte-producto.component.html',
  styleUrls: ['./add-edit-unificacion-aporte-producto.component.scss'],
})
export class AddEditUnificacionAporteProductoComponent {
  public formGroup: UntypedFormGroup;
  private element: any;
  public getErrorMessage = getErrorMessage;
  productos: IProducto[];

  constructor(
    private dataSharingService: DataSharingService,
    private utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        producto_principal: this.formGroup.get('producto_principal_cod')?.value,
        subproducto_principal: this.formGroup.get('subproducto_principal_cod')
          ?.value,
        producto_secundario: this.formGroup.get('producto_secundario_cod')
          ?.value,
        subproducto_secundario: this.formGroup.get('subproducto_secundario_cod')
          ?.value,
        unifica_aportes: 'S',
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  // * limpiar productos secundarios
  public clear(): void {
    if (this.data.edit) {
      this.formGroup.get('producto_secundario')?.setValue('');
      this.formGroup.get('producto_secundario_cod')?.setValue(null);
      this.formGroup.get('subproducto_secundario')?.setValue('');
      this.formGroup.get('subproducto_secundario_cod')?.setValue(null);
    }
  }

  public getProducto(): void {
    this.element = [];
    this.utilService.openLoading();
    // this.productoService
    //   .CRUD(
    //     JSON.stringify({
    //       par_modo: 'P',
    //     })
    //   )
    //   .subscribe({
    //     next: (res: any) => {
    //       this.element = Array.isArray(res.dataset)
    //         ? (res.dataset as IProducto[])
    //         : [res.dataset as IProducto];
    //     },
    //     error: (err: any) => {
    //       this.utilService.closeLoading();
    //       err.status == 0
    //         ? this.utilService.notification('Error de conexión. ', 'error')
    //         : this.utilService.notification(
    //             `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
    //             'error'
    //           );
    //     },
    //     complete: () => {
    //       this.utilService.closeLoading();
    //       this.setProducto(this.element);
    //     },
    //   });
  }
  
  private setProducto(data: IProductoAdministrador[]): void {
    const modal = this.dialog.open(SetProductoDialogComponent, {
      data: {
        title: 'SELECCIONE UN PRODUCTO ADMINISTADOR',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_principal = res?.producto_principal;
          this.data.subproducto_principal = res?.subproducto_principal;
          this.data.producto_secundario = res?.producto_secundario;
          this.data.unifica_aportes = res?.unifica_aportes;
        }
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      subproducto_principal: new UntypedFormControl({
        value: this.data.subproducto_principal
          ? this.data.subproducto_principal.trim()
          : '',
        disabled: true,
      }),
      producto_secundario: new UntypedFormControl(
        this.data.producto_secundario
      ),
      subproducto_secundario: new UntypedFormControl(
        this.data.subproducto_secundario
      ),
      producto_principal_cod: new UntypedFormControl(
        this.data.producto_principal_cod ? this.data.producto_principal_cod : 0,
        Validators.compose([
          Validators.maxLength(4),
          isNumeric()
        ])
      ),
      subproducto_principal_cod: new UntypedFormControl(
        this.data.subproducto_principal_cod
          ? this.data.subproducto_principal_cod
          : 0,
        Validators.compose([
          Validators.maxLength(4), 
          isNumeric()
        ])
      ),
      producto_secundario_cod: new UntypedFormControl(
        this.data.producto_secundario_cod
          ? this.data.producto_secundario_cod
          : 0,
        Validators.compose([
          Validators.maxLength(4), 
          isNumeric()
        ])
      ),
      subproducto_secundario_cod: new UntypedFormControl(
        this.data.subproducto_secundario_cod
          ? this.data.subproducto_secundario_cod
          : 0,
        Validators.compose([
          Validators.maxLength(4), 
          isNumeric()
        ])
      ),
    });
  }
}

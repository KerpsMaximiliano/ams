import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Material
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  getErrorMessage,
  isAlpha,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Components
import { UnificacionSetProductoDialogComponent } from './unificacion-set-producto-dialog/unificacion-set-producto-dialog.component';

@Component({
  selector: 'app-add-edit-unificacion-aporte-producto',
  templateUrl: './add-edit-unificacion-aporte-producto.component.html',
  styleUrls: ['./add-edit-unificacion-aporte-producto.component.scss'],
})
export class AddEditUnificacionAporteProductoComponent {
  private element: any;
  public producto: IProducto;
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    private utilService: UtilService,
    private productoService: ProductoService,
    private dialog: MatDialog,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.producto = this.productoService.get();
    this.setUpForm();
    this.configureValidators();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        producto_principal: this.data.producto_principal,
        subproducto_principal: this.data.subproducto_principal,
        producto_secundario: this.data.producto_secundario,
        subproducto_secundario: this.data.subproducto_secundario,
        unifica_aportes: this.formGroup.get('unifica_aportes')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public clear(
    inputElementOne: HTMLInputElement,
    controlNameOne: string,
    inputElementTwo?: HTMLInputElement,
    controlNameTwo?: string
  ): void {
    inputElementOne.value = '';
    this.formGroup.get(controlNameOne)?.setValue('');
    if (inputElementTwo) {
      inputElementTwo.value = '';
    }
    if (controlNameTwo) {
      this.formGroup.get(controlNameTwo)?.setValue('');
    }
  }

  public getProducto(): void {
    this.element = [];
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.element = Array.isArray(res.dataset)
            ? (res.dataset as IProducto[])
            : [res.dataset as IProducto];
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
          this.setProducto(this.element);
        },
      });
  }

  private setProducto(data: IProducto[]): void {
    const modal = this.dialog.open(UnificacionSetProductoDialogComponent, {
      data: {
        title: 'SELECCIONE UN PRODUCTO/SUBPRODUCTO',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_secundario = res?.producto_secundario;
          this.formGroup
            .get('descripcion_producto_secundario')
            ?.setValue(res?.producto_secundario_descripcion);

          this.data.subproducto_secundario = res?.subproducto_secundario;
          this.formGroup
            .get('descripcion_subproducto_secundario')
            ?.setValue(res?.subproducto_secundario_descripcion);
        }
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      descripcion_producto_principal: new UntypedFormControl({
        value: this.producto.descripcion_producto_administrador
          ? this.producto.descripcion_producto_administrador.trim()
          : this.producto.descripcion_producto
          ? this.producto.descripcion_producto.trim()
          : '',
        disabled: true,
      }),
      descripcion_subproducto_principal: new UntypedFormControl(
        {
          value: this.producto.descripcion_producto_administrador
            ? this.producto.descripcion_producto
              ? this.producto.descripcion_producto.trim()
              : ''
            : '',
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      descripcion_producto_secundario: new UntypedFormControl(
        {
          value: this.data.producto_principal_descripcion
            ? this.data.producto_principal_descripcion.trim()
            : this.data.subproducto_principal_descripcion
            ? this.data.subproducto_principal_descripcion.trim()
            : '',
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      descripcion_subproducto_secundario: new UntypedFormControl(
        {
          value: this.data.producto_principal_descripcion
            ? this.data.subproducto_principal_descripcion
              ? this.data.subproducto_principal_descripcion.trim()
              : ''
            : '',
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      unifica_aportes: new UntypedFormControl(
        {
          value: this.data.unifica_aportes
            ? this.data.unifica_aportes.trim()
            : '',
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
    });
  }

  private configureValidators(): void {
    this.formGroup
      .get('descripcion_producto_secundario')
      ?.valueChanges.subscribe((value) => {
        const control = this.formGroup.get(
          'descripcion_subproducto_secundario'
        );

        value
          ? control?.clearValidators()
          : control?.setValidators(
              Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30),
                notOnlySpaces(),
              ])
            );

        control?.updateValueAndValidity();
      });
  }
}

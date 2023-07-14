import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { UnificacionAporteProductoService } from 'src/app/core/services/unificacion-aporte-producto.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';
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
  public producto: IProducto;
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    private utilService: UtilService,
    private unificaAporteProductoService: UnificacionAporteProductoService,
    private productoService: ProductoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.producto = this.productoService.get();
    this.setUpForm();
    this.configureValidators();
  }

  public confirm(): void {
    if (this.data.par_modo === 'D') {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        producto_principal: this.data.producto_principal,
        subproducto_principal: this.data.subproducto_principal,
        producto_secundario: this.data.producto_secundario,
        subproducto_secundario: this.data.subproducto_secundario,
      });
    } else {
      if (this.formGroup.valid) {
        this.dataSharingService.sendData({
          par_modo: this.data.par_modo,
          producto_principal: this.producto.producto_administrador
            ? this.producto.producto_administrador
            : this.producto.codigo_producto,
          subproducto_principal: this.producto.producto_administrador
            ? this.producto.codigo_producto || 0
            : 0,
          producto_secundario: this.data.producto_secundario,
          subproducto_secundario: this.data.subproducto_secundario,
          unifica_aportes: 'S',
        });
      } else {
        this.formGroup.markAllAsTouched();
      }
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
    let data: IUnificacionAporteProducto[];
    this.utilService.openLoading();
    this.unificaAporteProductoService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
        })
      )
      .subscribe({
        next: (res: any) => {
          data = Array.isArray(res.dataset)
            ? (res.dataset as IUnificacionAporteProducto[])
            : [res.dataset as IUnificacionAporteProducto];
          this.setProducto(data);
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

  private setProducto(data: IUnificacionAporteProducto[]): void {
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
            .get('producto_secundario_descripcion')
            ?.setValue(res?.producto_secundario_descripcion);

          this.data.subproducto_secundario = res?.subproducto_secundario;
          this.formGroup
            .get('subproducto_secundario_descripcion')
            ?.setValue(res?.subproducto_secundario_descripcion);
        }
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      producto_principal_descripcion: new UntypedFormControl({
        value: this.data.producto_principal_descripcion,
        disabled: true,
      }),
      subproducto_principal_descripcion: new UntypedFormControl(
        {
          value: this.data.subproducto_principal_descripcion,
          disabled: true,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      producto_secundario_descripcion: new UntypedFormControl(
        {
          value: this.data.producto_secundario_descripcion,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      subproducto_secundario_descripcion: new UntypedFormControl(
        {
          value: this.data.subproducto_secundario_descripcion,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
    });
  }

  private configureValidators(): void {
    this.formGroup
      .get('producto_secundario_descripcion')
      ?.valueChanges.subscribe((value) => {
        const control = this.formGroup.get(
          'subproducto_secundario_descripcion'
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

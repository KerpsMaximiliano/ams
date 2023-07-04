import { Component, Inject } from '@angular/core';

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
import {
  getErrorMessage,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalProductoComponent } from './modal-producto/modal-producto.component';
@Component({
  selector: 'app-add-edit-unificador-aporte',
  templateUrl: './add-edit-unificador-aporte.component.html',
  styleUrls: ['./add-edit-unificador-aporte.component.scss'],
})
export class AddEditUnificadorAporteComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  productos: IProducto[];
  productoSelect: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.movimiento) this.setFormValues();
    if (this.data.edit === false) {
      this.formGroup.disable();
    }
  }

  // * carga de formulario y sus valores iniciales
  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      producto_principal: new UntypedFormControl({
        value: this.data.producto_principal
          ? this.data.producto_principal.trim()
          : '',
        disabled: true,
      }),
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
        Validators.compose([Validators.maxLength(4), isNumeric()])
      ),
      subproducto_principal_cod: new UntypedFormControl(
        this.data.subproducto_principal_cod
          ? this.data.subproducto_principal_cod
          : 0,
        Validators.compose([Validators.maxLength(4), isNumeric()])
      ),
      producto_secundario_cod: new UntypedFormControl(
        this.data.producto_secundario_cod
          ? this.data.producto_secundario_cod
          : 0,
        Validators.compose([Validators.maxLength(4), isNumeric()])
      ),
      subproducto_secundario_cod: new UntypedFormControl(
        this.data.subproducto_secundario_cod
          ? this.data.subproducto_secundario_cod
          : 0,
        Validators.compose([Validators.maxLength(4), isNumeric()])
      ),
    });
  }

  // * desabilita parte del formulario
  private setFormValues(): void {
    this.formGroup.get('producto_principal')?.disable;
    this.formGroup.get('subproducto_principal')?.disable;
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
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
    }
  }

  // * abre el buscador del modal
  public getProducto(): void {
    if (this.data.edit) {
      const ModalNuevoProductoComponent = this.dialog.open(
        ModalProductoComponent,
        {
          data: {},
        }
      );
      ModalNuevoProductoComponent.afterClosed().subscribe({
        next: (res: any) => {
          if (res) {
            this.productoSelect = res;
            this.formGroup
              .get('producto_secundario')
              ?.setValue(this.productoSelect.producto_principal);
            this.formGroup
              .get('producto_secundario_cod')
              ?.setValue(this.productoSelect.descripcion_producto_cod);
            this.formGroup
              .get('subproducto_secundario')
              ?.setValue(this.productoSelect.subproducto_principal);
            this.formGroup
              .get('subproducto_secundario_cod')
              ?.setValue(this.productoSelect.subproducto_principal_cod);
          }
        },
      });
    }
  }

  // * limpiar productos secundarios
  public limpiar(): void {
    if (this.data.edit) {
      this.productoSelect = '';
      this.formGroup.get('producto_secundario')?.setValue('');
      this.formGroup.get('producto_secundario_cod')?.setValue(0);
      this.formGroup.get('subproducto_secundario')?.setValue('');
      this.formGroup.get('subproducto_secundario_cod')?.setValue(0);
    }
  }
}

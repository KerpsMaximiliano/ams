import { Component, Inject } from '@angular/core';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

// * Validations
import {
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalExtencionProductoComponent } from './modal-extencion-producto/modal-extencion-producto.component';

@Component({
  selector: 'app-add-edit-extencion-fuente-ingreso',
  templateUrl: './add-edit-extencion-fuente-ingreso.component.html',
  styleUrls: ['./add-edit-extencion-fuente-ingreso.component.scss'],
})
export class AddEditExtencionFuenteIngresoComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
  //  * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 2. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'vigencia'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      if (this.data.edit === false) {
        this.formGroup.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      vigencia: new UntypedFormControl(
        this.data.vigencia ? this.data.vigencia : 0,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          notOnlySpaces(),
        ])
      ),
      fuenteIngreso: new UntypedFormControl(
        this.data.fuenteIngreso ? this.data.fuenteIngreso.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          notOnlySpaces(),
        ])
      ),
      producto: new UntypedFormControl(
        this.data.producto ? this.data.producto.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          notOnlySpaces(),
        ])
      ),
      producto_cod: new UntypedFormControl(
        this.data.producto_cod ? this.data.producto_cod : 0,
        Validators.compose([Validators.required, isNumeric()])
      ),
      remuneracionDesde: new UntypedFormControl(
        this.data.remuneracionDesde ? this.data.remuneracionDesde : 0,
        Validators.compose([
          Validators.required,
          Validators.maxLength(11),
          notOnlySpaces(),
        ])
      ),
      remuneracionHasta: new UntypedFormControl(
        this.data.remuneracionHasta ? this.data.remuneracionHasta : 0,
        Validators.compose([
          Validators.required,
          Validators.maxLength(11),
          notOnlySpaces(),
        ])
      ),
      coeficiente1: new UntypedFormControl(
        this.data.coeficiente1 ? this.data.coeficiente1 : 0.01,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente2: new UntypedFormControl(
        this.data.coeficiente2 ? this.data.coeficiente2 : 0.01,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente3: new UntypedFormControl(
        this.data.coeficiente3 ? this.data.coeficiente3 : 0.01,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente4: new UntypedFormControl(
        this.data.coeficiente4 ? this.data.coeficiente4 : 0.01,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente5: new UntypedFormControl(
        this.data.coeficiente5 ? this.data.coeficiente5 : 0.01,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
    });
  }

  getProducto() {
    const ModalNuevoProductoComponent = this.dialog.open(
      ModalExtencionProductoComponent,
      {
        data: {},
      }
    );
    ModalNuevoProductoComponent.afterClosed().subscribe({
      next: (res: any) => {
        if (res) {
          this.formGroup.get('producto')?.setValue(res.producto_principal);
          this.formGroup
            .get('producto_cod')
            ?.setValue(res.descripcion_producto_cod);
        }
      },
    });
  }

  public limpiar(): void {
    this.formGroup.get('producto')?.setValue('');
    this.formGroup.get('producto_cod')?.setValue(0);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  closeOpenDialog() {}

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        vigencia: this.formGroup.get('vigencia')?.value,
        fuenteingreso: this.formGroup.get('fuenteIngreso')?.value,
        producto: this.formGroup.get('producto')?.value,
        remuneracionDesde: this.formGroup.get('remuneracionDesde')?.value,
        remuneracionHasta: this.formGroup.get('remuneracionHasta')?.value,
        coeficiente1: this.formGroup.get('coeficiente1')?.value,
        coeficiente2: this.formGroup.get('coeficiente2')?.value,
        coeficiente3: this.formGroup.get('coeficiente3')?.value,
        coeficiente4: this.formGroup.get('coeficiente4')?.value,
        coeficiente5: this.formGroup.get('coeficiente5')?.value,
        reload: false,
      });
    }
  }
}

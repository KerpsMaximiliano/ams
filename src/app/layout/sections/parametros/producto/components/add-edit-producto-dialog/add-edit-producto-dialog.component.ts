import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlphanumericWithSpaces,
  isNumeric,
  notOnlySpacesValidator,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-producto-dialog',
  templateUrl: './add-edit-producto-dialog.component.html',
  styleUrls: ['./add-edit-producto-dialog.component.scss'],
})
export class AddEditProductoDialogComponent {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  /**
   * 1. Configura las validaciones (this.setUpForm()).
   * 2. Condición: Si la PK (codigo_producto) !== undefined.
   *   2.1. Configura los valores recibidos (this.setFormValues()).
   *   2.2. Deshabilita la PK (codigo_producto).
   * 3. Condición: Si el Par (par_modo) es 'C' (consulta) y la Edición (edit) no es verdadero.
   *   3.1. Deshabilita el formulario. A través de código SCSS se modifica para simular el estilo de un 'readonly'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo_producto !== undefined) {
      this.setFormValues();
      if (this.data.par_modo === 'C' && this.data.edit !== true) {
        this.formGroup.disable();
      }
      this.formGroup.get('codigo_producto')?.disable();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      // Campo de entrada (número).
      codigo_producto: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          isNumeric(),
        ])
      ),

      // Campo de entrada (texto).
      descripcion_producto: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          notOnlySpacesValidator(),
        ])
      ),

      // Campo de entrada (texto).
      descripcion_reducida: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          notOnlySpacesValidator(),
        ])
      ),

      // Select (texto).
      tipo_producto: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),

      // Campo de entrada (texto).
      administrado: new UntypedFormControl( // Verificar
        '',
        Validators.compose([Validators.required])
      ),

      // Select (texto).
      clase_producto: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isAlphanumericWithSpaces(),
          notOnlySpacesValidator(),
        ])
      ),

      // Campo de entrada (número).
      codigo_fuente_ingreso: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),

      // Select (texto).
      empresa: new UntypedFormControl( // Verificar
        '',
        Validators.compose([Validators.required])
      ),

      // Campo de entrada (texto).
      obra_social: new UntypedFormControl( // Verificar
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    if (this.data.codigo_producto !== undefined) {
      this.formGroup
        .get('codigo_producto')
        ?.setValue(this.data.codigo_producto);
    }

    if (this.data.descripcion_producto !== undefined) {
      this.formGroup
        .get('descripcion_producto')
        ?.setValue(this.data.descripcion_producto);
    }

    if (this.data.descripcion_reducida !== undefined) {
      this.formGroup
        .get('descripcion_reducida')
        ?.setValue(this.data.descripcion_reducida);
    }

    if (this.data.tipo_producto !== undefined) {
      this.formGroup.get('tipo_producto')?.setValue(this.data.tipo_producto);
    }

    if (this.data.administrado !== undefined) {
      this.formGroup.get('administrado')?.setValue(this.data.administrado);
    }

    if (this.data.clase_producto !== undefined) {
      this.formGroup.get('clase_producto')?.setValue(this.data.clase_producto);
    }

    if (this.data.codigo_fuente_ingreso !== undefined) {
      this.formGroup
        .get('codigo_fuente_ingreso')
        ?.setValue(this.data.codigo_fuente_ingreso);
    }

    if (this.data.empresa !== undefined) {
      this.formGroup.get('empresa')?.setValue(this.data.empresa);
    }

    if (this.data.obra_social !== undefined) {
      this.formGroup.get('obra_social')?.setValue(this.data.obra_social);
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_producto: this.formGroup.get('codigo_producto')?.value,
        descripcion_producto: this.formGroup.get('descripcion_producto')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        tipo_producto: this.formGroup.get('tipo_producto')?.value,
        administrado: this.formGroup.get('administrado')?.value,
        clase_producto: this.formGroup.get('clase_producto')?.value,
        codigo_fuente_ingreso: this.formGroup.get('codigo_fuente_ingreso')
          ?.value,
        empresa: this.formGroup.get('empresa')?.value,
        obra_social: this.formGroup.get('obra_social')?.value,
      });
    }
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres.`;
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
      }
      if (control.errors?.['notNumeric']) {
        return `Solo puede contener numeros.`;
      }
      if (control.errors?.['notAlphanumericWithSpaces']) {
        return `No puede contener caracteres especiales.`;
      }
      if (control.errors?.['notOnlySpaces']) {
        return `No puede contener solo espacios.`;
      }
      if (control.errors?.['notAlpha']) {
        return `Solo puede contener letras.`;
      }
    }
    return '';
  }

  /**
   * obj: Define las propiedades que serán enviadas.
   * route: Ruta de destino, ejemplo: 'estado-civil'. Dicha ruta tiene que tener coincidencia con la definida en el routing.module.
   * history.state.obj: Recupera el 'obj' enviado en el componente de destino. Ejemplo:
   * this.obj = history.state.obj;
   */
  public routes(route: string, obj: any): void {
    // Cierra el modal antes de redireccionar al usuario.
    this.closeDialog();

    // Redirecciona al usuario.
    this.router.navigate([`/parametros/${route}`], { state: { obj } });
  }
}

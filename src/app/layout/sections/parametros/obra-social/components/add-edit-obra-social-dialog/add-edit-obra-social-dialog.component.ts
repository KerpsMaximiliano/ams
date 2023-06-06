import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlphanumericWithPointAndSpaces,
  isNumeric,
  notOnlySpaces,
  notZeroValidator,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-obra-social-dialog',
  templateUrl: './add-edit-obra-social-dialog.component.html',
  styleUrls: ['./add-edit-obra-social-dialog.component.scss'],
})
export class AddEditObraSocialDialogComponent {
  public formGroup: UntypedFormGroup = new UntypedFormGroup({});
  public getErrorMessage = getErrorMessage;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
   * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 3. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'codigo'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('codigo')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl(
        this.data.codigo,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithPointAndSpaces(),
          notOnlySpaces(),
        ])
      ),
      propone_fecha_patologia: new UntypedFormControl(
        this.data.propone_fecha_patologia,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      tipo_fecha_patologia: new UntypedFormControl(
        this.data.tipo_fecha_patologia,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      tipo_obra_social_prepaga: new UntypedFormControl(
        this.data.tipo_obra_social_prepaga,
        Validators.compose([Validators.required])
      ),
      nro_registro: new UntypedFormControl(
        this.data.nro_registro,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          notZeroValidator(),
          isNumeric(),
        ])
      ),
      similar_SMP: new UntypedFormControl(
        this.data.similar_SMP,
        Validators.compose([Validators.required])
      ),
      omite_R420: new UntypedFormControl(
        this.data.omite_R420,
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup
      .get('propone_fecha_patologia')
      ?.setValue(this.data.propone_fecha_patologia);
    this.formGroup
      .get('tipo_fecha_patologia')
      ?.setValue(this.data.tipo_fecha_patologia);
    this.formGroup
      .get('tipo_obra_social_prepaga')
      ?.setValue(this.data.tipo_obra_social_prepaga);
    this.formGroup
      .get('nro_registro')
      ?.setValue(this.data.nro_registro);
    this.formGroup.get('similar_SMP')?.setValue(this.data.similar_SMP);
    this.formGroup.get('omite_R420')?.setValue(this.data.omite_R420);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        propone_fecha_patologia: this.formGroup.get('propone_fecha_patologia')
          ?.value,
        tipo_fecha_patologia: this.formGroup.get('tipo_fecha_patologia')?.value,
        tipo_obra_social_prepaga: this.formGroup.get('tipo_obra_social_prepaga')?.value,
        nro_registro: this.formGroup.get('nro_registro')?.value,
        similar_SMP: this.formGroup.get('similar_SMP')?.value,
        omite_R420: this.formGroup.get('omite_R420')?.value,
      });
    }
  }

  public changeProponeFechaPatologia() {
    const proponeFechaPatologiaControl = this.formGroup.get(
      'propone_fecha_patologia'
    );
    const tipoFechaPatologiaControl = this.formGroup.get('tipo_fecha_patologia');
    if (proponeFechaPatologiaControl?.value === 'N') {
      tipoFechaPatologiaControl?.setValue('');
      tipoFechaPatologiaControl?.disable();
    } else {
      tipoFechaPatologiaControl?.enable();
    }
  }
}

import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvinciaResponse } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-departamento-dialog',
  templateUrl: './add-edit-departamento-dialog.component.html',
  styleUrls: ['./add-edit-departamento-dialog.component.scss'],
})
export class AddEditDepartamentoDialogComponent {
  public formGroup: UntypedFormGroup;
  provincias$: Observable<IProvinciaResponse>;

  constructor(
    private provinciaService: ProvinciaService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
   * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 3. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'letra_provincia'.
   */
  ngOnInit(): void {
    // Verificar
    this.setUpForm();
    if (this.data.letra_provincia) this.setFormValues();

    this.provincias$ = this.provinciaService.provinciaList;
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('letra_provincia')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      letra_provincia: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo == 'U' },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      codigo_departamento: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo == 'U' },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          isAlphanumericWithSpaces,
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ])
      ),
      nombre_provincia: new UntypedFormControl({
        value: '',
        disabled: this.data.par_modo == 'U',
      }),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('letra_provincia')?.setValue(this.data.letra_provincia);
    this.formGroup
      .get('codigo_departamento')
      ?.setValue(this.data.codigo_departamento);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup
      .get('descripcion_reducida')
      ?.setValue(this.data.descripcion_reducida);
    this.formGroup
      .get('nombre_provincia')
      ?.setValue(this.data.nombre_provincia);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        letra_provincia: this.formGroup.get('letra_provincia')?.value,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        descripcion: this.formGroup.get('descripcion')?.value.trim(),
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
      });
    }
  }

  getErrorMessage(control: any) {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (
        (control.errors?.['notAlphanumeric'] ||
          control.errors?.['notAlphanumericWithSpaces']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
      if (control.errors?.['pattern']) {
        return `No puede contener letras, caracteres especiales`;
      }
    }
    return '';
  }
}

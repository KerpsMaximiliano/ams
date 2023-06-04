import { Component, Inject } from '@angular/core';

// * Services
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';

// * Form - Validations
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validations
import {
  isAlphanumericWithSpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-forma-pago-dialog',
  templateUrl: './add-edit-forma-pago-dialog.component.html',
  styleUrls: ['./add-edit-forma-pago-dialog.component.scss'],
})
export class AddEditFormaPagoDialogComponent {
  banks: any[] = [
    {
      codigo: '',
      description: '',
    },
  ];
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formaPagoService: FormaPagoService
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo !== undefined) {
      this.setFormValues();
    }
    if (!this.data.edit && this.data.par_modo === 'C') {
      this.formGroup.disable();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      forma_pago: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      codigo: new UntypedFormControl(
        { value: '', disabled: this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),

      description: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
          isAlphanumericWithSpaces(),
        ])
      ),

      nombre_tarjeta_nemot: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isAlphanumericWithSpaces(),
        ])
      ),

      codigo_banco: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      trabaja_archivos: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlphanumericWithSpaces(),
        ])
      ),

      trabaja_rechazos: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      solicita_datos_ad: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      codigo_tarjeta_de_baja: new UntypedFormControl({
        value: '',
        disabled: this.data.edit,
      }),
    });
  }

  private setFormValues(): void {
    // Código (codigo).
    this.formGroup.get('codigo')?.setValue(this.data.codigo);

    // Forma de Pago (forma_pago).
    if (
      this.data.forma_pago !== undefined &&
      this.data.forma_pago !== '' &&
      this.data.forma_pago !== null
    ) {
      this.formGroup.patchValue({
        forma_pago: this.data.forma_pago,
      });
    }

    // Descripción (description).
    if (this.data.description !== undefined) {
      this.formGroup.get('description')?.setValue(this.data.description);
    }

    // Nemotécnico (nombre_tarjeta_nemot).
    if (this.data.nombre_tarjeta_nemot !== undefined) {
      this.formGroup
        .get('nombre_tarjeta_nemot')
        ?.setValue(this.data.nombre_tarjeta_nemot);
    }

    // Banco (codigo_banco).
    if (this.data.codigo_banco !== undefined) {
      this.formGroup.patchValue({
        codigo_banco: this.data.codigo_banco,
      });
    }

    // ¿Trabaja con archivos? (trabaja_archivos).
    if (this.data.trabaja_archivos !== undefined) {
      this.formGroup.patchValue({
        trabaja_archivos: this.data.trabaja_archivos,
      });
    }

    // ¿Trabaja con rechazos? (trabaja_rechazos)
    if (this.data.trabaja_rechazos !== undefined) {
      this.formGroup.patchValue({
        trabaja_rechazos: this.data.trabaja_rechazos,
      });
    }

    // ¿Solicita datos adicionales? (solicita_datos_ad).
    if (this.data.solicita_datos_ad !== undefined) {
      this.formGroup.patchValue({
        solicita_datos_ad: this.data.solicita_datos_ad,
      });
    }

    // Estado (codigo_tarjeta_de_baja).
    if (this.data.codigo_tarjeta_de_baja !== undefined) {
      if (this.data.codigo_tarjeta_de_baja === 'S') {
        this.formGroup.get('codigo_tarjeta_de_baja')?.setValue('BAJA');
      } else {
        this.formGroup.get('codigo_tarjeta_de_baja')?.setValue('ACTIVO');
      }
    }
  }

  onChange(): void {
    if (this.formGroup.get('forma_pago')?.value !== undefined) {
      switch (this.formGroup.get('forma_pago')?.value) {
        case 'BSF':
          this.formGroup.patchValue({
            codigo_banco: 330,
          });
          break;
        case 'LNK':
          this.formGroup.patchValue({
            codigo_banco: 815,
          });
          break;
        case 'TC':
          this.formGroup.patchValue({
            codigo_banco: 0,
          });
          break;
        default:
          this.formaPagoService
            .CRUD(JSON.stringify({ par_modo: 'B', description: '' }))
            .subscribe((res: any) => {
              for (let i = 0; i < res.dataset.length; i++) {
                this.banks.push({
                  codigo: res.dataset[i].codigo,
                  description: res.dataset[i].description,
                });
              }
            });
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  changeStatus(): void {
    if (this.formGroup.get('codigo_tarjeta_de_baja')?.value === 'ACTIVO') {
      this.formGroup.get('codigo_tarjeta_de_baja')?.setValue('BAJA');
    }
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        forma_pago: this.formGroup.get('forma_pago')?.value,
        description: this.formGroup.get('description')?.value,
        nombre_tarjeta_nemot: this.formGroup.get('nombre_tarjeta_nemot')?.value,
        codigo_banco: this.formGroup.get('codigo_banco')?.value,
        trabaja_archivos: this.formGroup.get('trabaja_archivos')?.value,
        trabaja_rechazos: this.formGroup.get('trabaja_rechazos')?.value,
        solicita_datos_ad: this.formGroup.get('solicita_datos_ad')?.value,
        codigo_tarjeta_de_baja:
          this.formGroup.get('codigo_tarjeta_de_baja')?.value === 'BAJA'
            ? 'S'
            : '',
      });
    }
  }

  getErrorMessage(control: any): string {
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
    }
    return '';
  }
}

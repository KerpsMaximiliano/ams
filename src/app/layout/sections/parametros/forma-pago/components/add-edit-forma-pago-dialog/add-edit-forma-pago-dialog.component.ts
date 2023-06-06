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
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-forma-pago-dialog',
  templateUrl: './add-edit-forma-pago-dialog.component.html',
  styleUrls: ['./add-edit-forma-pago-dialog.component.scss'],
})
export class AddEditFormaPagoDialogComponent {
  public getErrorMessage = getErrorMessage;
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
        this.formGroup.get('forma_pago')?.disable();
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
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      forma_pago: new UntypedFormControl(
        this.data.forma_pago,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      description: new UntypedFormControl(
        this.data.description ? this.data.description.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isAlphanumericWithSpaces(),
        ])
      ),
      nombre_tarjeta_nemot: new UntypedFormControl(
        this.data.nombre_tarjeta_nemot
          ? this.data.nombre_tarjeta_nemot.trim()
          : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isAlphanumericWithSpaces(),
        ])
      ),
      codigo_banco: new UntypedFormControl(
        this.data.codigo_banco,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric,
        ])
      ),
      trabaja_archivos: new UntypedFormControl(
        this.data.trabaja_archivos,
        Validators.compose([Validators.required])
      ),
      trabaja_rechazos: new UntypedFormControl(
        this.data.trabaja_rechazos,
        Validators.compose([Validators.required])
      ),
      solicita_datos_ad: new UntypedFormControl(
        this.data.solicita_datos_ad,
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup.get('forma_pago')?.setValue(this.data.forma_pago);
    this.formGroup
      .get('description')
      ?.setValue(this.data.description ? this.data.description.trim() : '');
    this.formGroup
      .get('nombre_tarjeta_nemot')
      ?.setValue(
        this.data.nombre_tarjeta_nemot
          ? this.data.nombre_tarjeta_nemot.trim()
          : ''
      );
    this.formGroup.get('codigo_banco')?.setValue(this.data.codigo_banco);
    this.formGroup.patchValue({
      trabaja_archivos: this.data.trabaja_archivos,
    });
    this.formGroup.patchValue({
      trabaja_rechazos: this.data.trabaja_rechazos,
    });
    this.formGroup.patchValue({
      solicita_datos_ad: this.data.solicita_datos_ad,
    });
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
        forma_pago: this.formGroup.get('forma_pago')?.value,
        description: this.formGroup.get('description')?.value,
        nombre_tarjeta_nemot: this.formGroup.get('nombre_tarjeta_nemot')?.value,
        codigo_banco: this.formGroup.get('codigo_banco')?.value,
        trabaja_archivos: this.formGroup.get('trabaja_archivos')?.value,
        trabaja_rechazos: this.formGroup.get('trabaja_rechazos')?.value,
        solicita_datos_ad: this.formGroup.get('solicita_datos_ad')?.value,
        codigo_tarjeta_de_baja: this.formGroup.get('codigo_tarjeta_de_baja')
          ?.value,
      });
    }
  }

  public changeBank(): void {
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

  public changeStatus(): void {
    if (this.formGroup.get('codigo_tarjeta_de_baja')?.value === 'ACTIVO') {
      this.formGroup.get('codigo_tarjeta_de_baja')?.setValue('BAJA');
    }
  }
}

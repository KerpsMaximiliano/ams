import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';

// * Form - Validations
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isNumeric,
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-add-edit-forma-pago-dialog',
  templateUrl: './add-edit-forma-pago-dialog.component.html',
  styleUrls: ['./add-edit-forma-pago-dialog.component.scss'],
})
export class AddEditFormaPagoDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public activeTabIndex: number = 0;
  public banks: any[] = [
    {
      codigo: '',
      description: '',
    },
  ];

  constructor(
    private dataSharingService: DataSharingService,
    private formaPagoService: FormaPagoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.configureValidators();
  }

  public nextStep(): void {
    if (this.activeTabIndex !== 2) {
      this.activeTabIndex += 1;
    }
  }

  public prevStep(): void {
    if (this.activeTabIndex !== 0) {
      this.activeTabIndex -= 1;
    }
  }

  public tabChanged(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        forma_pago: this.formGroup.get('forma_pago')?.value,
        description: this.formGroup.get('description')?.value,
        nombre_tarjeta_nemot: this.formGroup.get('nombre_tarjeta_nemot')?.value,
        codigo_banco: this.formGroup.get('codigo_banco')?.value
          ? this.formGroup.get('codigo_banco')?.value
          : 0,
        trabaja_archivos: this.formGroup.get('trabaja_archivos')?.value,
        trabaja_rechazos: this.formGroup.get('trabaja_rechazos')?.value,
        solicita_datos_ad: this.formGroup.get('solicita_datos_ad')?.value,
        codigo_tarjeta_de_baja: this.data.codigo_tarjeta_de_baja
          ? this.data.codigo_tarjeta_de_baja
          : '',
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private configureValidators(): void {
    this.formGroup.get('forma_pago')?.valueChanges.subscribe((value) => {
      const control = this.formGroup.get('codigo_banco');

      switch (value) {
        case 'BSF':
          control?.patchValue(330);
          control?.clearValidators();
          control?.disable();
          break;
        case 'LNK':
          control?.patchValue(815);
          control?.clearValidators();
          control?.disable();
          break;
        case 'TC ':
          control?.reset();
          control?.clearValidators();
          control?.disable();
          break;
        case 'CBU':
          control?.setValidators([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(3),
          ]);
          control?.enable();
          control?.reset();
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
          break;
        default:
          break;
      }

      control?.updateValueAndValidity();
    });
  }

  public changeStatus(): void {
    this.data.codigo_tarjeta_de_baja === 'S'
      ? (this.data.codigo_tarjeta_de_baja = '')
      : (this.data.codigo_tarjeta_de_baja = 'S');
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl(
        {
          value: this.data.codigo,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      forma_pago: new UntypedFormControl(
        {
          value: this.data.forma_pago,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      description: new UntypedFormControl(
        {
          value: this.data.description ? this.data.description.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          notOnlySpaces(),
        ])
      ),
      nombre_tarjeta_nemot: new UntypedFormControl(
        {
          value: this.data.nombre_tarjeta_nemot
            ? this.data.nombre_tarjeta_nemot.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          notOnlySpaces(),
        ])
      ),
      codigo_banco: new UntypedFormControl({
        value: this.data.codigo_banco,
        disabled: true,
      }),
      trabaja_archivos: new UntypedFormControl(
        {
          value: this.data.trabaja_archivos
            ? this.data.trabaja_archivos.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      trabaja_rechazos: new UntypedFormControl(
        {
          value: this.data.trabaja_rechazos
            ? this.data.trabaja_rechazos.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      solicita_datos_ad: new UntypedFormControl(
        {
          value: this.data.solicita_datos_ad
            ? this.data.solicita_datos_ad.trim()
            : '',
          disabled: this.data.par_modo === 'R',
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
}

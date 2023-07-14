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
  public banco: boolean;
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
  }

  ngAfterViewInit() {
    this.banco = true;
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
        codigo_banco: this.formGroup.get('codigo_banco')?.value,
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

  public changeBank(): void {
    if (this.formGroup.get('forma_pago')?.value !== undefined) {
      switch (this.formGroup.get('forma_pago')?.value) {
        case 'BSF':
          this.banco = true;
          this.configureValidators();
          this.formGroup.patchValue({
            codigo_banco: 330,
          });
          break;
        case 'LNK':
          this.banco = true;
          this.configureValidators();
          this.formGroup.patchValue({
            codigo_banco: 815,
          });
          break;
        case 'TC ':
          this.banco = true;
          this.configureValidators();
          this.formGroup.patchValue({
            codigo_banco: null,
          });
          break;
        case 'CBU':
          this.banco = false;
          this.configureValidators();
          this.formGroup.patchValue({
            codigo_banco: null,
          });
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
      }
    }
  }

  public changeStatus(): void {
    this.data.codigo_tarjeta_de_baja = 'S';
    this.confirm();
  }

  private configureValidators(): void {
    if (this.formGroup.get('forma_pago')?.value === 'CBU') {
      this.formGroup
        .get('codigo_banco')
        ?.setValidators([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ]);
    } else {
      this.formGroup.get('codigo_banco')?.clearValidators();
    }
    this.formGroup.get('codigo_banco')?.updateValueAndValidity();
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
      codigo_banco: new UntypedFormControl(
        this.data.codigo_banco,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric(),
        ])
      ),
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

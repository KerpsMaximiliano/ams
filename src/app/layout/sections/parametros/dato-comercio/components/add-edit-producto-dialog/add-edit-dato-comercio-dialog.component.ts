import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Interfaces
import { UtilService } from 'src/app/core/services/util.service';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';
import { IBanco } from 'src/app/core/models/dato-comercio.interface';
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { SetBancoDialogComponent } from './set-banco-dialog/set-banco-dialog.component';

@Component({
  selector: 'app-add-edit-dato-comercio-dialog',
  templateUrl: './add-edit-dato-comercio-dialog.component.html',
  styleUrls: ['./add-edit-dato-comercio-dialog.component.scss'],
})
export class AddEditDatoComercioDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public visibilidad: boolean = false;
  public activeTabIndex = 0;
  public booleanPago: boolean = true;
  public uploaded: boolean = false;
  public listTarjetas: IFormaPago[];

  constructor(
    private dataSharingService: DataSharingService,
    private formaPagoService: FormaPagoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.formGroup.get('codigo_tarjeta')?.disable();
    if (this.data.formas_pago) this.uploaded = true;
  }

  public nextStep(): void {
    if (this.activeTabIndex === 0) {
      this.activeTabIndex += 1;
    }
  }

  public prevStep(): void {
    if (this.activeTabIndex === 1) {
      this.activeTabIndex -= 1;
    }
  }

  public tabChanged(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }

  public confirm(): void {
    if (this.data.par_modo === 'D') {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        id_empresa: this.data.empresa_factura.id_empresa,
        forma_pago: this.formGroup.get('forma_pago')?.value
          ? this.formGroup.get('forma_pago')?.value.trim()
          : this.formGroup.get('forma_pago')?.value,
        codigo_tarjeta: this.formGroup.get('codigo_tarjeta')?.value,
      });
    } else if (
      this.formGroup.valid &&
      this.formGroup.get('codigo_tarjeta')?.value !== null
    ) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        id_empresa: this.data.empresa_factura.id_empresa,
        forma_pago: this.formGroup.get('forma_pago')?.value
          ? this.formGroup.get('forma_pago')?.value.trim()
          : this.formGroup.get('forma_pago')?.value,
        codigo_tarjeta: this.formGroup.get('codigo_tarjeta')?.value,
        nro_comercio: this.formGroup.get('nro_comercio')?.value,
        codigo_servicio: this.formGroup.get('codigo_servicio')?.value,
        nro_caja: this.formGroup.get('nro_caja')?.value,
        id_banco: this.data.id_banco,
        banco_descripcion: this.data.banco_descripcion,
        nro_suc: this.formGroup.get('nro_suc')?.value,
        car_dest: '',
        prg_gen: '',
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public clear(inputElement: HTMLInputElement, controlName: string): void {
    inputElement.value = '';
    this.formGroup.get(controlName)?.setValue('');
  }

  public clearInput() {
    this.data.id_banco = undefined;
    this.data.banco_descripcion = undefined;
    this.formGroup.get('banco_descripcion')?.setValue(undefined);
  }

  public getCodigoTarjeta(formaPago: any) {
    this.formGroup.get('codigo_tarjeta')?.setValue(undefined);
    this.utilService.openLoading();
    this.formaPagoService
      .CRUD(
        JSON.stringify({
          par_modo: 'H',
          forma_pago: formaPago,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.listTarjetas = Array.isArray(res.dataset)
            ? (res.dataset as IFormaPago[])
            : [res.dataset as IFormaPago];
          this.booleanPago = false;
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status === 0
            ? this.utilService.notification('Error de conexión.', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
          this.formGroup.get('codigo_tarjeta')?.disable();
          this.booleanPago = true;
        },
        complete: () => {
          this.formGroup
            .get('codigo_tarjeta')
            ?.setValidators([
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(2),
            ]);
          this.formGroup.get('codigo_tarjeta')?.reset();
          this.utilService.closeLoading();
        },
      });
  }

  public getBanco(): void {
    let data: IBanco[];
    this.utilService.openLoading();
    this.formaPagoService
      .CRUD(
        JSON.stringify({
          par_modo: 'B',
        })
      )
      .subscribe({
        next: (res: any) => {
          data = Array.isArray(res.dataset)
            ? (res.dataset as IBanco[])
            : [res.dataset as IBanco];

          this.setBanco(data);
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

  private setBanco(data: IBanco[]): void {
    const modal = this.dialog.open(SetBancoDialogComponent, {
      data: {
        title: 'SELECCIONE UN BANCO',
        data: data,
        id_banco: this.data.id_banco,
      },
    });
    modal.afterClosed().subscribe({
      next: (banco: IBanco) => {
        if (banco) {
          this.data.id_banco = banco?.codigo;
          this.formGroup.get('banco_descripcion')?.setValue(banco?.description);
        }
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      forma_pago: new UntypedFormControl(
        {
          value: this.data.forma_pago,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      codigo_tarjeta: new UntypedFormControl(
        {
          value: this.data.codigo_tarjeta,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      nro_comercio: new UntypedFormControl(
        {
          value: this.data.nro_comercio,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(11),
          isNumeric(),
        ])
      ),
      codigo_servicio: new UntypedFormControl(
        {
          value: this.data.codigo_servicio,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      nro_caja: new UntypedFormControl(
        {
          value: this.data.nro_caja,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          isNumeric(),
        ])
      ),
      banco_descripcion: new UntypedFormControl(
        {
          value: this.data.banco_descripcion,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'D',
        },
        Validators.compose([Validators.required])
      ),
      nro_suc: new UntypedFormControl(
        {
          value: this.data.nro_suc,
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric(),
        ])
      ),
    });
  }
}

import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';

// * Interfaces
import { IDepartamento } from 'src/app/core/models/departamento.interface';

// * Forms
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
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-localidad-dialog',
  templateUrl: './add-edit-localidad-dialog.component.html',
  styleUrls: ['./add-edit-localidad-dialog.component.scss'],
})
export class AddEditLocalidadDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;

  public departamentos: IDepartamento[];

  constructor(
    private departamentoService: DepartamentoService,
    private utilService: UtilService,
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_postal: this.formGroup.get('codigo_postal')?.value,
        sub_codigo_postal: this.formGroup.get('sub_codigo_postal')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        cant_habitantes: this.formGroup.get('cant_habitantes')?.value,
        letra_provincia: this.formGroup.get('letra_provincia')?.value,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        posicion_referente: this.formGroup.get('posicion_referente')?.value,
        zona_promocion: this.formGroup.get('zona_promocion')?.value,
        zona_envio: this.formGroup.get('zona_envio')?.value,
        ingreso_ticket: this.formGroup.get('ingreso_ticket')?.value,
        visitado_auditor: this.formGroup.get('visitado_auditor')?.value,
      });
    }
  }

  public getDepartamentos(value: string): void {
    this.utilService.openLoading();
    this.departamentoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          letra_provincia: value,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.data.departamentos = Array.isArray(res.dataset)
            ? (res.dataset as IDepartamento[])
            : [res.dataset as IDepartamento];
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status == 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
          }
          if (err.status == 404) {
            this.departamentos = [];
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_postal: new UntypedFormControl(
        {
          value: this.data.codigo_postal,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(7),
          isNumeric,
        ])
      ),
      sub_codigo_postal: new UntypedFormControl(
        {
          value: this.data.sub_codigo_postal,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      cant_habitantes: new UntypedFormControl(
        {
          value: this.data.cant_habitantes,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(8),
          isNumeric(),
        ])
      ),
      letra_provincia: new UntypedFormControl(
        {
          value: this.data.letra_provincia,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      codigo_departamento: new UntypedFormControl(
        {
          value: this.data.codigo_departamento,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      zona_promocion: new UntypedFormControl(
        {
          value: this.data.zona_promocion,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      zona_envio: new UntypedFormControl(
        {
          value: this.data.zona_envio ? this.data.zona_envio.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      ingreso_ticket: new UntypedFormControl(
        {
          value: this.data.ingreso_ticket
            ? this.data.ingreso_ticket.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      visitado_auditor: new UntypedFormControl(
        {
          value: this.data.visitado_auditor
            ? this.data.visitado_auditor.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
    });
  }
}

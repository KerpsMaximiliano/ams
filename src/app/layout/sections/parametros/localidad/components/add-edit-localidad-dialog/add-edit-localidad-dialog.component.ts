import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Forms
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
  selector: 'app-edit-localidad-dialog',
  templateUrl: './add-edit-localidad-dialog.component.html',
  styleUrls: ['./add-edit-localidad-dialog.component.scss'],
})
export class AddEditLocalidadDialogComponent {
  paramDepto: [] | any;
  paramProv: [] | any;
  paramZonaP: [] | any;
  paramZonaE: [] | any;
  public formGroup: UntypedFormGroup;
  myControldepto = new UntypedFormControl('');
  deptoFiltrados: Observable<any[]>;

  constructor(
    private localidadService: LocalidadService,
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit(): Promise<void> {
    this.setUpForm();
    if (this.data.codigo_postal) this.setFormValues();
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia: '',
    };
    await this.localidadService.getProvincia(bodyprov).subscribe({
      next: (res) => {
        this.paramProv = res.dataset;
      },
      error: (err) => {
        console.log(err);
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
    let bodyzonaP = {
      par_modo: 'P',
    };
    this.localidadService.getZona(bodyzonaP).subscribe({
      next: (res) => {
        this.paramZonaP = res.dataset;
        console.log(this.paramZonaP);
      },
      error: (err) => {
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
              'error'
            );
      },
    });
    let bodyzonaE = {
      par_modo: 'E',
    };
    this.localidadService.getZona(bodyzonaE).subscribe({
      next: (res) => {
        this.paramZonaE = res.dataset;
      },
      error: (err) => {
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_postal: new UntypedFormControl(
        {
          value: '',
          disabled:
            this.data.codigo_postal && this.data.title === 'EDITAR LOCALIDAD',
        },
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(4),
          Validators.required,
          isNumeric,
        ])
      ),
      sub_codigo_postal: new UntypedFormControl(
        {
          value: '',
          disabled:
            this.data.codigo_postal && this.data.title === 'EDITAR LOCALIDAD',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces,
        ])
      ),
      letra_provincia: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      flete_transporte: new UntypedFormControl(0),
      posicion_referente: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric,
        ])
      ),
      visitado_auditor: new UntypedFormControl(
        { value: 'N', disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      zona_promocion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      desc_depto: new UntypedFormControl(''),
      codigo_departamento: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      zona_envio: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ])
      ),
      ingreso_ticket: new UntypedFormControl(
        { value: 'N', disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      cant_habitantes: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.maxLength(8),
          Validators.minLength(1),
          isNumeric,
        ])
      ),
    });
  }

  buscar(letra_provincia: string) {
    let bodydep = {
      par_modo: 'C',
      descripcion: '',
      letra_provincia: letra_provincia,
    };
    this.localidadService.getDepart(bodydep).subscribe({
      next: (res) => {
        this.paramDepto = res.dataset;
      },
      error: (err) => {
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje} .`,
              'error'
            );
      },
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_postal')?.setValue(this.data.codigo_postal);
    this.formGroup
      .get('sub_codigo_postal')
      ?.setValue(this.data.sub_codigo_postal);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup.get('letra_provincia')?.setValue(this.data.letra_provincia);
    this.formGroup
      .get('flete_transporte')
      ?.setValue(this.data.flete_transporte);
    this.formGroup
      .get('posicion_referente')
      ?.setValue(this.data.posicion_referente);
    this.formGroup
      .get('visitado_auditor')
      ?.setValue(this.data.visitado_auditor);
    this.formGroup.get('zona_promocion')?.setValue(this.data.zona_promocion);
    this.formGroup
      .get('codigo_departamento')
      ?.setValue(this.data.codigo_departamento);
    this.formGroup.get('desc_depto')?.setValue(this.data.desc_depto);
    this.formGroup.get('zona_envio')?.setValue(this.data.zona_envio);
    this.formGroup.get('ingreso_ticket')?.setValue(this.data.ingreso_ticket);
    this.formGroup.get('cant_habitantes')?.setValue(this.data.cant_habitantes);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_postal
        ? this.dialogRef.close({
            par_modo: 'U',
            codigo_postal: parseInt(this.formGroup.get('codigo_postal')?.value),
            sub_codigo_postal: parseInt(
              this.formGroup.get('sub_codigo_postal')?.value
            ),
            descripcion: this.formGroup.get('descripcion')?.value,
            letra_provincia: this.formGroup.get('letra_provincia')?.value,
            flete_transporte: this.formGroup.get('flete_transporte')?.value,
            posicion_referente: parseInt(
              this.formGroup.get('posicion_referente')?.value
            ),
            visitado_auditor: this.formGroup.get('visitado_auditor')?.value,
            zona_promocion: parseInt(
              this.formGroup.get('zona_promocion')?.value
            ),
            codigo_departamento: parseInt(
              this.formGroup.get('codigo_departamento')?.value
            ),
            zona_envio: this.formGroup.get('zona_envio')?.value,
            ingreso_ticket: this.formGroup.get('ingreso_ticket')?.value,
            cant_habitantes: parseInt(
              this.formGroup.get('cant_habitantes')?.value
            ),
          })
        : this.dialogRef.close({
            par_modo: 'I',
            codigo_postal: parseInt(this.formGroup.get('codigo_postal')?.value),
            sub_codigo_postal: parseInt(
              this.formGroup.get('sub_codigo_postal')?.value
            ),
            descripcion: this.formGroup.get('descripcion')?.value,
            letra_provincia: this.formGroup.get('letra_provincia')?.value,
            flete_transporte: this.formGroup.get('flete_transporte')?.value,
            posicion_referente: parseInt(
              this.formGroup.get('posicion_referente')?.value
            ),
            visitado_auditor: this.formGroup.get('visitado_auditor')?.value,
            zona_promocion: parseInt(
              this.formGroup.get('zona_promocion')?.value
            ),
            codigo_departamento: parseInt(
              this.formGroup.get('codigo_departamento')?.value
            ),
            zona_envio: this.formGroup.get('zona_envio')?.value,
            ingreso_ticket: this.formGroup.get('ingreso_ticket')?.value,
            cant_habitantes: parseInt(
              this.formGroup.get('cant_habitantes')?.value
            ),
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

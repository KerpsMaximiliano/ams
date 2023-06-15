import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

// * Validations
import {
  isAlphanumericWithSpaces,
  isNumeric,
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { PosicionSetDialogComponent } from './posicion-set-dialog/posicion-set-dialog.component';

@Component({
  selector: 'app-add-edit-posicion-dialog',
  templateUrl: './add-edit-posicion-dialog.component.html',
  styleUrls: ['./add-edit-posicion-dialog.component.scss'],
})
export class AddEditPosicionDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public provincias: IProvincia[];
  public date: Date;

  constructor(
    private utils: UtilService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private localidadService: LocalidadService
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
    this.setUpForm();
    if (this.data.par_modo !== 'C') {
      this.searchLocalidadDescripcion();
      this.formGroup.get('codigo_posicion')?.disable();
      this.formGroup.get('estado')?.disable();
      if (this.data.edit !== true) {
        this.formGroup.disable();
      }
    }
    this.date = new Date();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_posicion: new UntypedFormControl(
        this.data.codigo_posicion,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      localidad: new UntypedFormControl(
        this.data.localidad ? this.data.localidad.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      domicilio: new UntypedFormControl(
        this.data.domicilio ? this.data.domicilio.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          notOnlySpaces(),
        ])
      ),
      control_rechazo: new UntypedFormControl(
        this.data.control_rechazo,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      yes_no: new UntypedFormControl(
        this.data.yes_no,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      fecha_vigencia: new UntypedFormControl(this.data.fecha_vigencia),
    });
  }

  private searchLocalidadDescripcion(): void {
    if (this.data.codigo_postal && this.data.letra_provincia) {
      this.utils.openLoading();
      this.localidadService
        .CRUD(
          JSON.stringify({
            par_modo: 'R',
            codigo_postal: this.data.codigo_postal,
            letra_provincia: this.data.letra_provincia,
          })
        )
        .subscribe({
          next: (res: any) => {
            this.data.localidad = res.dataset.descripcion
              ? res.dataset.descripcion.trim()
              : '';
          },
          error: (err: any) => {
            this.utils.closeLoading();
            err.status == 0
              ? this.utils.notification(
                  'No se ha podido cargar la localidad. ',
                  'error'
                )
              : this.utils.notification(
                  `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                  'error'
                );
          },
          complete: () => {
            this.utils.closeLoading();
            this.setFormValues();
          },
        });
    }
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_posicion')?.setValue(this.data.codigo_posicion);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup
      .get('localidad')
      ?.setValue(this.data.localidad ? this.data.localidad : '');
    this.formGroup
      .get('domicilio')
      ?.setValue(this.data.domicilio ? this.data.domicilio.trim() : '');
    this.formGroup.patchValue({
      yes_no: this.data.yes_no,
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_posicion: this.formGroup.get('codigo_posicion')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        domicilio: this.formGroup.get('domicilio')?.value,
        codigo_postal: this.data.codigo_postal,
        sub_codigo_postal: this.data.sub_codigo_postal,
        control_rechazo: this.formGroup.get('control_rechazo')?.value,
        yes_no: this.formGroup.get('yes_no')?.value,
        fecha_vigencia: this.data.fecha_vigencia,
        letra_provincia: this.data.letra_provincia,
      });
    }
  }

  public setDate(): void {
    if (this.data.fecha_vigencia === 0) {
      this.data.fecha_vigencia = this.formatDate();
    } else {
      this.data.fecha_vigencia = 0;
    }
  }

  private formatDate(): number {
    const day = this.date.getDate();
    const month = this.date.getMonth() + 1;
    const year = this.date.getFullYear();

    const dayFormat = day < 10 ? `0${day}` : day.toString();
    const monthFormat = month < 10 ? `0${month}` : month.toString();

    return parseInt(`${dayFormat}${monthFormat}${year}`);
  }

  public searchLocalidad(): void {
    const modalSetLocalidad = this.dialog.open(PosicionSetDialogComponent, {
      data: {
        title: 'SELECCIONE UNA LOCALIDAD',
        edit: true,
        provincias: this.data.provincias,
        letra_provincia: this.data.letra_provincia,
        descripcion: this.data.descripcion,
        codigo_postal: this.data.codigo_postal,
        sub_codigo_postal: this.data.sub_codigo_postal,
      },
    });
    modalSetLocalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.letra_provincia = res.letra_provincia;
          this.data.codigo_postal = res.codigo_postal;
          this.data.sub_codigo_postal = res.sub_codigo_postal;
          this.data.localidad = res.descripcion;
          this.formGroup
            .get('localidad')
            ?.setValue(this.data.localidad ? this.data.localidad.trim() : '');
        }
      },
    });
  }

  public clearLocalidad(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}

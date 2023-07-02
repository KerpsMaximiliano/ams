import { Component, Inject, OnInit } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

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
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// * Components
import { PosicionSetDialogComponent } from './posicion-set-dialog/posicion-set-dialog.component';

@Component({
  selector: 'app-add-edit-posicion-dialog',
  templateUrl: './add-edit-posicion-dialog.component.html',
  styleUrls: ['./add-edit-posicion-dialog.component.scss'],
})
export class AddEditPosicionDialogComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public date: Date;

  constructor(
    private localidadService: LocalidadService,
    private utilService: UtilService,
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.setUpForm();
    this.date = new Date();
  }

  ngOnInit(): void {
    if (this.data.par_modo !== 'C') {
      this.searchLocalidadDescripcion();
    }
  }

  public setDate(): void {
    if (this.data.fecha_vigencia === 0) {
      this.data.fecha_vigencia = this.formatDate();
    } else {
      this.data.fecha_vigencia = 0;
    }
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

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_posicion: this.formGroup.get('codigo_posicion')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        domicilio: this.formGroup.get('domicilio')?.value,
        codigo_postal: this.data.codigo_postal,
        sub_codigo_postal: this.data.sub_codigo_postal,
        control_rechazo: this.formGroup.get('control_rechazo')?.value,
        yes_no: this.formGroup.get('yes_no')?.value,
        fecha_vigencia: this.data.fecha_vigencia ? this.data.fecha_vigencia : 0,
        letra_provincia: this.data.letra_provincia,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_posicion: new UntypedFormControl(
        {
          value: this.data.codigo_posicion,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      localidad: new UntypedFormControl(
        {
          value: this.data.localidad ? this.data.localidad.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      domicilio: new UntypedFormControl(
        {
          value: this.data.domicilio ? this.data.domicilio.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          notOnlySpaces(),
        ])
      ),
      control_rechazo: new UntypedFormControl(
        {
          value: this.data.control_rechazo
            ? this.data.control_rechazo.trim()
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
      yes_no: new UntypedFormControl(
        {
          value: this.data.yes_no ? this.data.yes_no.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      fecha_vigencia: new UntypedFormControl({
        value: this.data.fecha_vigencia,
        disabled: this.data.par_modo === 'R',
      }),
    });
  }

  private searchLocalidadDescripcion(): void {
    if (this.data.codigo_postal && this.data.letra_provincia) {
      this.utilService.openLoading();
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
            this.utilService.closeLoading();
            if (err.status === 0) {
              this.utilService.notification('Error de conexión.', 'error');
            } else {
              this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
            }
          },
          complete: () => {
            this.utilService.closeLoading();
            this.formGroup
              .get('localidad')
              ?.setValue(this.data.localidad ? this.data.localidad.trim() : '');
          },
        });
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
}

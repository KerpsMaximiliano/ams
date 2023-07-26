import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

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
  notChar,
  afterComma,
  isNumberAndComma,
  onlyTwoDecimal,
  isMax,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-tambo-dialog',
  templateUrl: './add-edit-tambo-dialog.component.html',
  styleUrls: ['./add-edit-tambo-dialog.component.scss'],
})
export class AddEditTamboDialogComponent {
  private date: Number;
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public status: string;

  constructor(
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.validate();
    this.status = this.setStatus();
    if (this.data.par_modo === 'U') {
      this.date = this.formatDate(new Date());
    }
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data?.par_modo,
        id_empresa: this.data?.id_empresa,
        id_tambos: this.formGroup.get('id_tambos')?.value,
        razon_social: this.formGroup.get('razon_social')?.value,
        grasa_ent: this.formGroup
          .get('grasa_ent')
          ?.value.toString()
          .replace(',', '.'),
        fecha_suspension: this.data?.fecha_suspension,
        fecha_rehabilitacion: this.data?.fecha_rehabilitacion,
        localidad: this.formGroup.get('localidad')?.value,
        provincia: this.formGroup.get('provincia')?.value,
        fecha_baja: this.data?.fecha_baja,
        emp_vinc_ent: this.data?.emp_vinc_ent,
        ent_sancor: this.data?.ent_sancor,
        canal: this.data?.canal,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public handleProvince(letra_provincia: string): string {
    const province = this.data.provincias.find(
      (provincia: IProvincia) => provincia.codigo == letra_provincia
    );
    return province ? province.nombre_provincia : '';
  }

  public validateNumberInput(event: KeyboardEvent): void {
    const inputValue: string = this.formGroup.get('grasa_ent')?.value;
    if (
      (inputValue.length === 0 && event.key === ',') ||
      (inputValue.length === 0 && event.key === '.')
    ) {
      event.preventDefault();
    } else {
      if (
        (inputValue.includes(',') && event.key === ',') ||
        (inputValue.includes(',') && event.key === '.')
      ) {
        event.preventDefault();
      }
    }
  }

  public delete(): void {
    if (this.data.fecha_baja === 0) {
      this.dataSharingService.sendData({
        par_modo: 'CE',
        estado: 'B',
        id_empresa: this.data.id_empresa ? this.data.id_empresa : 0,
        id_tambos: this.data.id_tambos ? this.data.id_tambos : 0,
        fecha_baja: this.date,
      });
    }
  }

  public handleStatus(): void {
    if (this.data.fecha_baja === 0) {
      if (this.data.fecha_suspension === 0) {
        this.dataSharingService.sendData({
          par_modo: 'CE',
          estado: 'S',
          id_empresa: this.data.id_empresa ? this.data.id_empresa : 0,
          id_tambos: this.data.id_tambos ? this.data.id_tambos : 0,
          fecha_suspension: this.date,
        });
      } else {
        this.dataSharingService.sendData({
          par_modo: 'CE',
          estado: 'R',
          id_empresa: this.data.id_empresa ? this.data.id_empresa : 0,
          id_tambos: this.data.id_tambos ? this.data.id_tambos : 0,
          fecha_rehabilitacion: this.date,
        });
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      id_tambos: new UntypedFormControl(
        {
          value: this.data.id_tambos,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      razon_social: new UntypedFormControl(
        {
          value: this.data.razon_social ? this.data.razon_social.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          notOnlySpaces(),
        ])
      ),
      provincia: new UntypedFormControl(
        {
          value: this.data.provincia ? this.data.provincia.trim() : '',
          disabled: this.data.par_modo === 'R' || !this.data.provincias,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
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
          Validators.maxLength(22),
          notOnlySpaces(),
        ])
      ),
      grasa_ent: new UntypedFormControl(
        {
          value: this.data.grasa_ent ? this.data.grasa_ent : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          notChar(),
          isNumberAndComma(),
          afterComma(),
          onlyTwoDecimal(),
          isMax(),
        ])
      ),
    });
  }

  private validate(): void {
    this.formGroup.get('grasa_ent')?.valueChanges.subscribe((value: any) => {
      if (value[0] === ',') {
        this.formGroup.get('grasa_ent')?.setValue('');
      }
      if (value.includes('.')) {
        this.formGroup.get('grasa_ent')?.setValue(value.replace('.', ','));
      }
    });
  }

  private setStatus(): string {
    if (this.data.fecha_baja !== 0) {
      return 'BAJA';
    }

    if (
      this.data.fecha_baja === 0 &&
      this.data.fecha_suspension === 0 &&
      this.data.fecha_rehabilitacion === 0
    ) {
      return 'ACTIVO';
    }

    if (this.data.fecha_baja === 0 && this.data.fecha_suspension !== 0) {
      return 'SUSPENDIDO';
    }

    return 'REHABILITADO';
  }

  private formatDate(date: Date): number {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return Number(`${year}${month}${day}`);
  }
}

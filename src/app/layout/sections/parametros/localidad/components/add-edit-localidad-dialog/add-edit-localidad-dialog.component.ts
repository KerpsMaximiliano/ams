import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { PosicionService } from 'src/app/core/services/posicion.service';

// * Interfaces
import { IPosicion } from 'src/app/core/models/posicion.interface';
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
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { LocalidadSetDialogComponent } from './localidad-set-posicion-dialog/localidad-set-posicion-dialog.component';

@Component({
  selector: 'app-edit-localidad-dialog',
  templateUrl: './add-edit-localidad-dialog.component.html',
  styleUrls: ['./add-edit-localidad-dialog.component.scss'],
})
export class AddEditLocalidadDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public activeTabIndex: number = 0;
  public booleanDep: boolean;
  public departamentos: IDepartamento[];

  constructor(
    private dataSharingService: DataSharingService,
    private departamentoService: DepartamentoService,
    private posicionService: PosicionService,
    private dialog: MatDialog,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.booleanDep = true;
    this.setUpForm();
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
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_postal: this.formGroup.get('codigo_postal')?.value,
        sub_codigo_postal: this.formGroup.get('sub_codigo_postal')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        cant_habitantes: this.formGroup.get('cant_habitantes')?.value,
        letra_provincia: this.formGroup.get('letra_provincia')?.value,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        posicion_referente: this.data.posicion_referente,
        zona_promocion: this.formGroup.get('zona_promocion')?.value,
        zona_envio: this.formGroup.get('zona_envio')?.value
          ? this.formGroup.get('zona_envio')?.value
          : '',
        ingreso_ticket: this.formGroup.get('ingreso_ticket')?.value,
        visitado_auditor: this.formGroup.get('visitado_auditor')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public getDepartamentos(value: string): void {
    this.utilService.openLoading();
    console.log(value);
    this.data.letra_provincia = value;
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
          this.booleanDep = false;
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

  public getPosicion(): void {
    this.utilService.openLoading();
    this.posicionService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          letra_provincia: this.data.letra_provincia,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IPosicion[] = Array.isArray(res.dataset)
            ? (res.dataset as IPosicion[])
            : [res.dataset as IPosicion];
          this.setPosicion(data);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
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

  public clear() {
    this.formGroup.get('desc_position')?.setValue(undefined);
    this.data.posicion_referente = undefined;
  }

  private setPosicion(data: IPosicion[]) {
    const modalCapita = this.dialog.open(LocalidadSetDialogComponent, {
      data: {
        title: 'SELECCIONE UNA POSICIÓN',
        data: data,
      },
    });
    modalCapita.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.posicion_referente = res.posicion_referente;
          this.formGroup
            .get('desc_position')
            ?.setValue(res.descripcion ? res.descripcion.trim() : ' ');
        }
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
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      codigo_departamento: new UntypedFormControl(
        {
          value: this.data.codigo_departamento,
          disabled:
            this.data.par_modo === 'R' ||
            this.data.letra_provincia === undefined ||
            this.data.letra_provincia === null,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      desc_position: new UntypedFormControl(
        {
          value: this.data.desc_position,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      zona_promocion: new UntypedFormControl(
        {
          value: this.data.zona_promocion,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      zona_envio: new UntypedFormControl({
        value: this.data.zona_envio ? this.data.zona_envio : '',
        disabled: this.data.par_modo === 'R',
      }),
      ingreso_ticket: new UntypedFormControl(
        {
          value: this.data.ingreso_ticket
            ? this.data.ingreso_ticket.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      visitado_auditor: new UntypedFormControl(
        {
          value: this.data.visitado_auditor
            ? this.data.visitado_auditor.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
    });
  }
}

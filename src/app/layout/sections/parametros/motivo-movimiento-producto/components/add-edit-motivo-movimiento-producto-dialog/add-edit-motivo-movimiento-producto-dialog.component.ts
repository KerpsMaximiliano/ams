import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { MotivoMovimientoProductoService } from 'src/app/core/services/motivo-movimiento-producto.service';

// * Interfaces
import { IMotivoMovimientoProducto } from 'src/app/core/models/motivo-movimiento-producto.interface';
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';
import { IDialog } from 'src/app/core/models/dialog.interface';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  isAlpha,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// * Components
import { SetMotivoDialogComponent } from './set-motivo-dialog/set-motivo-dialog.component';

@Component({
  selector: 'app-add-edit-motivo-movimiento-producto-dialog',
  templateUrl: './add-edit-motivo-movimiento-producto-dialog.component.html',
  styleUrls: ['./add-edit-motivo-movimiento-producto-dialog.component.scss'],
})
export class AddEditMotivoMovimientoProductoDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    private motivoMovimientoProductoService: MotivoMovimientoProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public clear(inputElement: HTMLInputElement, controlName: string): void {
    inputElement.value = '';
    this.formGroup.get(controlName)?.setValue('');
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        tipo_motivo: this.formGroup.get('tipo_motivo')?.value[0],
        codigo_motivo: this.data.codigo_motivo,
        id_producto: this.data.producto.codigo_producto,
        descripcion: this.formGroup.get('descripcion')?.value,
        datos_adicionales: this.formGroup.get('datos_adicionales')?.value,
        otra_cobertura: this.formGroup.get('otra_cobertura')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public getMotivoMovimientoProducto(): void {
    this.utilService.openLoading();
    this.motivoMovimientoProductoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          tipo_motivo: this.formGroup.get('tipo_motivo')?.value,
          id_producto: this.data.producto.codigo_producto,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IMotivoMovimiento[] = Array.isArray(res.dataset)
            ? (res.dataset as IMotivoMovimiento[])
            : [res.dataset as IMotivoMovimiento];
          this.setDialog(data);
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

  public redirectTo(url: string): void {
    const data: IMotivoMovimientoProducto = {
      par_modo: this.data.par_modo,
      tipo_motivo: this.data.tipo_motivo,
      codigo_motivo: this.data.codigo_motivo,
      id_producto: this.data.id_producto,
      descripcion: this.data.descripcion,
      datos_adicionales: this.data.datos_adicionales,
      otra_cobertura: this.data.otra_cobertura,
    };
    this.motivoMovimientoProductoService.set(data);
    this.router.navigate([url]);
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      tipo_motivo: new UntypedFormControl(
        {
          value: this.data.tipo_motivo,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      datos_adicionales: new UntypedFormControl(
        {
          value: this.data.datos_adicionales
            ? this.data.datos_adicionales.trim()
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
      otra_cobertura: new UntypedFormControl(
        {
          value: this.data.otra_cobertura
            ? this.data.otra_cobertura.trim()
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

  private setDialog(data: IMotivoMovimiento[]): void {
    const modal = this.dialog.open(SetMotivoDialogComponent, {
      data: {
        title: 'SELECCIONE UN MOTIVO DE MOVIMIENTO',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res: any) => {
        this.data.codigo_motivo = res?.id_motivo;
        (this.data.tipo_motivo = res?.tipo_motivo),
          (this.data.descripcion = res?.descripcion);
        this.formGroup
          .get('descripcion')
          ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
      },
    });
  }
}

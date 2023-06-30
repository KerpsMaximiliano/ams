import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SetMotivoMovimientoDialogComponent } from './set-motivo-movimiento-dialog/set-motivo-movimiento-dialog.component';
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';
import { UtilService } from 'src/app/core/services/util.service';
import { IDialog } from 'src/app/core/models/dialog.interface';

@Component({
  selector: 'app-add-edit-movimiento-producto-dialog',
  templateUrl: './add-edit-movimiento-producto-dialog.component.html',
  styleUrls: ['./add-edit-movimiento-producto-dialog.component.scss'],
})
export class AddEditMovimientoProductoDialogComponent {
  private element: IDialog[];
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    private motivoMovimientoService: MotivoMovimientoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        tipo_motivo: this.formGroup.get('tipo_motivo')?.value[0],
        id_motivo: this.data.id_motivo,
        id_producto: this.data.producto.codigo_producto,
        datos_adicionales: this.formGroup.get('datos_adicionales')?.value,
        otra_cobertura: this.formGroup.get('otra_cobertura')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
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
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      datos_adicionales: new UntypedFormControl(
        this.data.datos_adicionales,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      otra_cobertura: new UntypedFormControl(
        this.data.otra_cobertura,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
    });
  }

  public getData(): void {
    this.utilService.openLoading();
    this.motivoMovimientoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          tipo_motivo: this.formGroup.get('tipo_motivo')?.value,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          let datas: IMotivoMovimiento[] = Array.isArray(res.dataset)
            ? (res.dataset as IMotivoMovimiento[])
            : [res.dataset as IMotivoMovimiento];

          this.element = datas.map((data: IMotivoMovimiento) => {
            return {
              codigo: data.id_motivo,
              descripcion: data.descripcion,
            };
          });
          this.setDialog(this.element);
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
            this.element = [];
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private setDialog(data: any): void {
    const modal = this.dialog.open(SetMotivoMovimientoDialogComponent, {
      data: data,
    });

    modal.afterClosed().subscribe({
      next: (res: any) => {
        this.data.id_motivo = res?.codigo;
        this.data.descripcion = res?.descripcion;
        this.formGroup
          .get('descripcion')
          ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
      },
    });
  }
}

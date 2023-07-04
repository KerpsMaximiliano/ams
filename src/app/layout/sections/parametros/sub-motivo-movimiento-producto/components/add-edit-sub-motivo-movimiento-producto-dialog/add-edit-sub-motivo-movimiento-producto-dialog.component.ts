import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';

// * Validators
import {
  getErrorMessage,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-sub-motivo-movimiento-producto-dialog',
  templateUrl:
    './add-edit-sub-motivo-movimiento-producto-dialog.component.html',
  styleUrls: [
    './add-edit-sub-motivo-movimiento-producto-dialog.component.scss',
  ],
})
export class AddEditSubMotivoMovimientoProductoDialogComponent {
  private date: Number;
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public estado: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public utils: UtilService,
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.date = this.formatDate(new Date());
    if (this.data.par_modo === 'U') {
      if (this.data.fecha_vigencia === 0) {
        this.estado = true;
      }
    }
    this.setUpForm();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        producto: this.data.codigo_producto,
        codigo_motivo: this.data.movimiento.codigo_motivo,
        movimiento: this.data.movimiento.tipo_motivo,
        codigo_submotivo: this.data.codigo_submotivo
          ? this.data.codigo_submotivo
          : 0,
        descripcion: this.formGroup.get('descripcion')?.value,
        fecha_vigencia: this.data.fecha_vigencia,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public setStatus(): void {
    if (this.formGroup.valid) {
      if (this.data.fecha_vigencia === 0) {
        this.data.fecha_vigencia = this.date;
      } else {
        this.data.fecha_vigencia = 0;
      }
      this.confirm();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private formatDate(date: Date): number {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return Number(`${year}${month}${day}`);
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(60),
          notOnlySpaces(),
        ])
      ),
    });
  }
}

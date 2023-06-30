import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { SubmotivoMovimientoService } from 'src/app/core/services/submotivo-movimiento.service';

// * Validators
import {
  getErrorMessage,
  isAlphanumericWithSpaces,
  isNumeric,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-submotivo-movimiento',
  templateUrl: './add-edit-submotivo-movimiento.component.html',
  styleUrls: ['./add-edit-submotivo-movimiento.component.scss'],
})
export class AddEditSubmotivoMovimientoComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public paramMov: any;
  public vigencia: boolean = false;
  private fecha_hoy: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public utils: UtilService,
    private SubmotivoMovimientoService: SubmotivoMovimientoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.submotivoOption();
  }

  ngOnInit() {
    this.setUpForm();
    if (this.data.movimiento) this.setFormValues();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
      }
    }
  }

  // * caraga el select de submotivos
  public submotivoOption(): void {
    let bodyMov = {
      par_modo: 'O',
      movimiento: this.data.movimiento,
      codigo_motivo: this.data.codigo_motivo,
      producto: this.data.codigo_producto,
      descripcion: '',
    };
    this.SubmotivoMovimientoService.CRUD(
      JSON.stringify(bodyMov)
    ).subscribe({
      next: (res: any) => {
        this.paramMov = res.dataset;
      },
      error: (err) => {
        err.status == 0
          ? this.utils.notification('Error de conexion', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}:
        ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
  }

  // * carga los datos de codigo y descripcion de submotivo
  public dato(codigo: number, descripcion: string): void {
    this.formGroup.get('codigo_submotivo')?.setValue(codigo);
    this.formGroup.get('descripcion')?.setValue(descripcion);
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      producto: new UntypedFormControl(
        this.data.producto ? this.data.producto.trim() : '',
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      codigo_producto: new UntypedFormControl(
        this.data.codigo_producto ? this.data.codigo_producto : 0,
        Validators.compose([Validators.maxLength(4), isNumeric()])
      ),
      movimiento: new UntypedFormControl(
        this.data.movimiento ? this.data.movimiento.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      codigo_motivo: new UntypedFormControl(
        this.data.codigo_motivo ? this.data.codigo_motivo : 0,
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          isNumeric,
        ])
      ),
      codigo_submotivo: new UntypedFormControl(
        this.data.codigo_submotivo ? this.data.codigo_submotivo : 0,
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion,
        Validators.compose([
          Validators.maxLength(60),
          Validators.required,
          isAlphanumericWithSpaces,
        ])
      ),
      fecha_vigencia: new UntypedFormControl(
        this.data.fecha_vigencia ? this.data.fecha_vigencia : 0,
        Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(8),
          isNumeric,
        ])
      ),
    });
  }

  private setFormValues(): void {
    if (this.data.par_modo == 'C') {
      this.formGroup.get('fecha_vigencia')?.setValue(0);
      this.vigencia = true;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        movimiento: this.formGroup.get('movimiento')?.value,
        codigo_motivo: this.formGroup.get('codigo_motivo')?.value,
        producto: this.formGroup.get('codigo_producto')?.value,
        codigo_submotivo: this.formGroup.get('codigo_submotivo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        fecha_vigencia: this.fecha(),
      });
    }
  }

  // * modifica la fecha a numero
  public fecha(): number {
    let auxFecha: number;
    let ano = this.fecha_hoy.getFullYear().toString();
    let mes = (this.fecha_hoy.getMonth() + 1).toString();
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let dia = this.fecha_hoy.getDate().toString();
    if (dia.length == 1) {
      dia = '0' + dia;
    }
    auxFecha = parseInt(ano + mes + dia);
    return auxFecha;
  }
}

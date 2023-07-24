import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Services
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

// * Validations
import { getErrorMessage } from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

// * Components

@Component({
  selector: 'app-add-edit-pago-link-dialog',
  templateUrl: './add-edit-pago-link-dialog.component.html',
  styleUrls: ['./add-edit-pago-link-dialog.component.scss'],
})
export class AddEditPagoLinkDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public activeTabIndex = 0;
  public icon: string;
  public errorFecha: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public empresaFacturaService: EmpresaFacturaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  ngOnInit() {
    this.setFormValues();
    this.formGroup.get('empresa_factura')?.disable();
  }

  // * carga los formularios
  private setUpForm(): void {
    // * primer formulario
    this.formGroup = new UntypedFormGroup({
      empresa_factura: new UntypedFormControl(
        this.data.empresa_factura ? this.data.empresa_factura : ''
      ),
      empresa_factura_descripcion: new UntypedFormControl(
        this.data.empresa_factura_descripcion
          ? this.data.empresa_factura_descripcion
          : ''
      ),
      codigo_forma_pago: new UntypedFormControl(
        this.data.codigo_forma_pago ? this.data.codigo_forma_pago : '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
    });
  }
  private setFormValues(): void {}

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        empresa_factura: this.formGroup.get('empresa_factura')?.value,
        codigo_forma_pago: this.formGroup.get('codigo_forma_pago')?.value,
      });
    }
  }
}

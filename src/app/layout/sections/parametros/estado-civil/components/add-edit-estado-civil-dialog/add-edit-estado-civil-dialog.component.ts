import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-estado-civil-dialog',
  templateUrl: './add-edit-estado-civil-dialog.component.html',
  styleUrls: ['./add-edit-estado-civil-dialog.component.scss'],
})
export class AddEditEstadoCivilDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_estado_civil: this.formGroup.get('codigo_estado_civil')?.value,
        description: this.formGroup.get('description')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_estado_civil: new UntypedFormControl(
        {
          value: this.data.codigo_estado_civil,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ]
      ),
      description: new UntypedFormControl(
        {
          value: this.data.description ? this.data.description.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          notOnlySpaces(),
        ]
      ),
    });
  }
}

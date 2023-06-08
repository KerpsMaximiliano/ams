import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import {
  IProvincia,
  IProvinciaResponse,
} from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlphanumericWithSpaces,
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-departamento-dialog',
  templateUrl: './add-edit-departamento-dialog.component.html',
  styleUrls: ['./add-edit-departamento-dialog.component.scss'],
})
export class AddEditDepartamentoDialogComponent {
  public formGroup: UntypedFormGroup;
  provincias: IProvincia[] = [];
  public getErrorMessage = getErrorMessage;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilService,
    private provinciaService: ProvinciaService
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
  }

  ngAfterViewInit(): void {
    let body;
    if (this.formGroup.get('letra_provincia')?.value) {
      body = {
        par_modo: 'R',
        codigo: this.formGroup.get('letra_provincia')?.value,
      };
    } else {
      body = {
        par_modo: 'O',
        nombre_provincia: '',
      };
    }
    this.utils.openLoading();
    this.provinciaService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        res.dataset.length
          ? (this.provincias = res.dataset as IProvincia[])
          : (this.provincias = [res.dataset]);
      },
      complete: () => {
        if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
          this.setFormValues();
          if (this.data.edit === false) {
            this.formGroup.disable();
          } else {
            this.formGroup.get('nombre_provincia')?.disable();
            this.formGroup.get('codigo_departamento')?.disable();
          }
        }
        this.utils.closeLoading();
        console.log(this.provincias);
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      nombre_provincia: new UntypedFormControl(
        this.data.nombre_provincia ? this.data.nombre_provincia.trim() : '',
        Validators.compose([Validators.required])
      ),
      codigo_departamento: new UntypedFormControl(
        this.data.codigo_departamento,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.patchValue({
      nombre_provincia: this.data.nombre_provincia
        ? this.data.nombre_provincia.trim()
        : '',
    });
    this.formGroup
      .get('codigo_departamento')
      ?.setValue(this.data.codigo_departamento);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup
      .get('descripcion_reducida')
      ?.setValue(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : ''
      );
    console.log(this.formGroup.get('letra_provincia')?.value);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        letra_provincia: this.formGroup.get('letra_provincia')?.value,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        descripcion: this.formGroup.get('descripcion')?.value.trim(),
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
      });
    }
  }
}

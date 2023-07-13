import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

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
  isAlphanumeric,
  isNumeric,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { AtributosRelacionCapitaPlanSetProductoDialogComponent } from '../atributos-relacion-capita-plan-set-producto-dialog/atributos-relacion-capita-plan-set-producto-dialog.component';

@Component({
  selector: 'app-add-edit-atributos-relacion-capita-plan-dialog',
  templateUrl:
    './add-edit-atributos-relacion-capita-plan-dialog.component.html',
  styleUrls: [
    './add-edit-atributos-relacion-capita-plan-dialog.component.scss',
  ],
})
export class AddEditAtributosRelacionCapitaPlanDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public activeTabIndex: number = 0;
  public icon: string;

  constructor(
    private dataSharingService: DataSharingService,
    private productoService: ProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.configureValidators();
  }

  public nextStep(): void {
    if (this.activeTabIndex !== 3) {
      this.activeTabIndex += 1;
    }
  }

  public prevStep(): void {
    if (this.activeTabIndex !== 0) {
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
        codigo_fuente_adm_mixta: this.data?.codigo_fuente_adm_mixta,
        cod_fuente_subordinada: this.data?.cod_fuente_subordinada,
        producto_cap_adm: this.data?.producto_cap_adm,
        producto_cap_sub: this.data?.producto_cap_sub,
        // Desde usuario. Modificar formGroup 'plan_producto_cap_adm' por this.data. ...
        plan_producto_cap_adm: this.formGroup.get('plan_producto_cap_adm')
          ?.value,
        genera_liquidacion: this.formGroup.get('genera_liquidacion')?.value,
        mod_carga_afiliacion: this.formGroup.get('mod_carga_afiliacion')?.value,
        solicita_ddjj: this.formGroup.get('solicita_ddjj')?.value,
        liquida_mensualmente: this.formGroup.get('liquida_mensualmente')?.value,
        calcula_comision_SN: this.formGroup.get('calcula_comision_SN')?.value,
        recupera_Ob_Soc: this.formGroup.get('recupera_Ob_Soc')?.value,
        reaseguro_SN: this.formGroup.get('reaseguro_SN')?.value,
        legajo: this.formGroup.get('legajo')?.value,
        zona: this.formGroup.get('zona')?.value,
        division: this.formGroup.get('division')?.value,
        seccion: this.formGroup.get('seccion')?.value,
        subseccion: this.formGroup.get('subseccion')?.value,
        val_cod_empresa: this.formGroup.get('val_cod_empresa')?.value,
        controla_dec_juradas: this.formGroup.get('controla_dec_juradas')?.value,
        modelo_dec_jurada_vig: this.formGroup.get('modelo_dec_jurada_vig')
          ?.value,
        modelo_cuest_baja_vig: this.formGroup.get('modelo_cuest_baja_vig')
          ?.value,
        descripcion_plan: this.formGroup.get('descripcion_plan')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public clear(
    inputElementOne: HTMLInputElement,
    controlNameOne: string,
    inputElementTwo?: HTMLInputElement,
    controlNameTwo?: string
  ): void {
    inputElementOne.value = '';
    this.formGroup.get(controlNameOne)?.setValue('');
    if (inputElementTwo) {
      inputElementTwo.value = '';
    }
    if (controlNameTwo) {
      this.formGroup.get(controlNameTwo)?.setValue('');
    }
  }

  public getProducto(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
          codigo_fuente_ingreso: this.data.codigo_fuente_adm_mixta,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IProducto[] = Array.isArray(res.dataset)
            ? (res.dataset as IProducto[])
            : [res.dataset as IProducto];
          this.setProducto(data);
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

  private configureValidators(): void {
    this.formGroup
      .get('descripcion_producto')
      ?.valueChanges.subscribe((value) => {
        const control = this.formGroup.get('descripcion_subproducto');

        value
          ? control?.clearValidators()
          : control?.setValidators(Validators.required);

        control?.updateValueAndValidity();
      });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      descripcion_fuente_adm_mixta: new UntypedFormControl(
        {
          value: this.data.fuenteIngreso.descripcion_fuente_adm_mixta
            ? this.data.fuenteIngreso.descripcion_fuente_adm_mixta.trim()
            : this.data.fuenteIngreso.descripcion
            ? this.data.fuenteIngreso.descripcion.trim()
            : '',
          disabled: true,
        },
        Validators.required
      ),
      descripcion_fuente_subordinada: new UntypedFormControl({
        value: this.data.fuenteIngreso.descripcion_fuente_adm_mixta
          ? this.data.fuenteIngreso.descripcion
            ? this.data.fuenteIngreso.descripcion.trim()
            : ''
          : '',
        disabled: true,
      }),
      descripcion_producto: new UntypedFormControl(
        {
          value: this.data.descripcion_producto
            ? this.data.descripcion_producto.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          notOnlySpaces(),
        ])
      ),
      descripcion_subproducto: new UntypedFormControl(
        {
          value: this.data.descripcion_subproducto
            ? this.data.descripcion_subproducto.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.required
      ),
      descripcion_plan: new UntypedFormControl(
        {
          value: this.data.descripcion_plan
            ? this.data.descripcion_plan.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
      genera_liquidacion: new UntypedFormControl(
        {
          value: this.data.genera_liquidacion
            ? this.data.genera_liquidacion.trim()
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
      mod_carga_afiliacion: new UntypedFormControl(
        {
          value: this.data.mod_carga_afiliacion
            ? this.data.mod_carga_afiliacion.trim()
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
      solicita_ddjj: new UntypedFormControl(
        {
          value: this.data.solicita_ddjj ? this.data.solicita_ddjj.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      liquida_mensualmente: new UntypedFormControl(
        {
          value: this.data.liquida_mensualmente
            ? this.data.liquida_mensualmente.trim()
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
      calcula_comision_SN: new UntypedFormControl(
        {
          value: this.data.calcula_comision_SN
            ? this.data.calcula_comision_SN.trim()
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
      reaseguro_SN: new UntypedFormControl(
        {
          value: this.data.reaseguro_SN ? this.data.reaseguro_SN.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      legajo: new UntypedFormControl(
        {
          value: this.data.legajo ? this.data.legajo.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      zona: new UntypedFormControl(
        {
          value: this.data.zona ? this.data.zona.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      division: new UntypedFormControl(
        {
          value: this.data.division ? this.data.division.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      seccion: new UntypedFormControl(
        {
          value: this.data.seccion ? this.data.seccion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      subseccion: new UntypedFormControl(
        {
          value: this.data.subseccion ? this.data.subseccion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      val_cod_empresa: new UntypedFormControl(
        {
          value: this.data.val_cod_empresa
            ? this.data.val_cod_empresa.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
        ])
      ),
      controla_dec_juradas: new UntypedFormControl(
        {
          value: this.data.controla_dec_juradas
            ? this.data.controla_dec_juradas.trim()
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
      modelo_dec_jurada_vig: new UntypedFormControl(
        {
          value: this.data.modelo_dec_jurada_vig
            ? this.data.modelo_dec_jurada_vig.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isAlphanumeric(),
        ])
      ),
      modelo_cuest_baja_vig: new UntypedFormControl(
        {
          value: this.data.modelo_cuest_baja_vig
            ? this.data.modelo_cuest_baja_vig.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isAlphanumeric(),
        ])
      ),
      recupera_Ob_Soc: new UntypedFormControl(
        {
          value: this.data.recupera_Ob_Soc
            ? this.data.recupera_Ob_Soc.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          isAlphanumeric(),
        ])
      ),
    });
  }

  private setProducto(data: IProducto[]): void {
    1;
    const modal = this.dialog.open(
      AtributosRelacionCapitaPlanSetProductoDialogComponent,
      {
        data: {
          title: 'SELECCIONE UN PRODUCTO/SUBPRODUCTO',
          data: data,
        },
      }
    );
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_cap_adm =
            res?.producto_administrador || res?.codigo_producto || 0;
          this.formGroup
            .get('descripcion_producto')
            ?.setValue(
              res?.descripcion_producto_administrador.trim() ||
                res?.descripcion_producto.trim() ||
                ''
            );

          this.data.producto_cap_sub = res.producto_administrador
            ? res?.codigo_producto
            : 0;

          this.formGroup
            .get('descripcion_subproducto')
            ?.setValue(
              res?.descripcion_producto_administrador
                ? res?.descripcion_producto.trim()
                : ''
            );
        }
      },
    });
  }
}

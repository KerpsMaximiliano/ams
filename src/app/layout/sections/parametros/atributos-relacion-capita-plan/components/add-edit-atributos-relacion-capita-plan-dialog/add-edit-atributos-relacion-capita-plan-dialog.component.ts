import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
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
          codigo_fuente_ingreso: this.data.fuenteIngreso.codigo_fuente_admin
            ? this.data.fuenteIngreso.codigo_fuente_admin
            : this.data.fuenteIngreso.codigo_fuente_ingreso,
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
          ? this.data.fuenteIngreso.descripcion_fuente_subordinada
            ? this.data.fuenteIngreso.descripcion_fuente_subordinada.trim()
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
      descripcion_subproducto: new UntypedFormControl({
        value: this.data.descripcion_subproducto
          ? this.data.descripcion_subproducto.trim()
          : '',
        disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
      }),
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
          this.data.producto_administrador =
            res?.producto_administrador || res?.codigo_producto || 0;
          this.formGroup
            .get('descripcion_producto_administrador')
            ?.setValue(
              res?.descripcion_producto_administrador.trim() ||
                res?.descripcion_producto.trim() ||
                ''
            );

          this.data.codigo_producto = res.producto_administrador
            ? res?.codigo_producto
            : 0;
          this.formGroup
            .get('descripcion_producto_subordinado')
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

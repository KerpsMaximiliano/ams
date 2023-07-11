import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Interface
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

// * Validations
import {
  getErrorMessage,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Material
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalLocalidadComponent } from './modal-localidad/modal-localidad.component';
import { LocalidadService } from 'src/app/core/services/localidad.service';

@Component({
  selector: 'app-add-edit-empresa-factura',
  templateUrl: './add-edit-empresa-factura.component.html',
  styleUrls: ['./add-edit-empresa-factura.component.scss'],
})
export class AddEditEmpresaFacturaComponent {
  empresaFactura: IEmpresaFactura[];
  public formInitial: UntypedFormGroup;
  public formSecond: UntypedFormGroup;
  public formThird: UntypedFormGroup;
  public formFinal: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public listaModo: IEmpresaFactura;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private utils: UtilService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public empresaFacturaService: EmpresaFacturaService,
    public localidadService: LocalidadService
  ) {}

  ngOnInit() {
    this.setUpForm();
    if (this.data.id_empresa !== undefined) {
      this.setFormValues();
      this.loadModo();
      this.loadLocalidad();
      if (this.data.par_modo === 'C' && this.data.edit !== true) {
        this.formInitial.disable();
        this.formSecond.disable();
        this.formThird.disable();
        this.formFinal.disable();
      }
      this.formInitial.get('id_empresa')?.disable();
    }
  }

  // * carga de la lista
  private loadModo(): void {
    this.empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'E',
          id_empresa: this.data.id_empresa,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.formFinal.get('modo')?.setValue(res.dataset.modo);
        },
        error: (err: any) => {
          err.status == 0
            ? this.utils.notification('Error de conexión. ', 'error')
            : this.utils.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                'error'
              );
        },
      });
  }

  validarModo() {
    console.log(this.formFinal);

    //   this.empresaFacturaService
    //     .CRUD(
    //       JSON.stringify({
    //         par_modo: 'M',
    //         id_empresa: this.formInitial.get('id_empresa')?.value,
    //         modo: this.formFinal.get('modo')?.value,
    //       })
    //     )
    //     .subscribe({
    //       next: (res: any) => {
    //         this.utils.notification(res.estado.Mensaje);
    //       },
    //       error: (err: any) => {
    //         err.status == 0
    //           ? this.utils.notification('Error de conexión. ', 'error')
    //           : this.utils.notification(
    //               `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
    //               'error'
    //             );
    //       },
    //     });
  }

  // * carga los formularios
  private setUpForm(): void {
    // * primer formulario
    this.formInitial = new UntypedFormGroup({
      id_empresa: new UntypedFormControl(
        this.data.id_empresa ? this.data.id_empresa : ''
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ),
      calle: new UntypedFormControl(
        this.data.calle ? this.data.calle.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ),
      nro_puerta: new UntypedFormControl(
        this.data.nro_puerta ? this.data.nro_puerta : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      piso: new UntypedFormControl(
        this.data.piso ? this.data.piso : '',
        Validators.compose([Validators.maxLength(2)])
      ),
      departamento: new UntypedFormControl(
        this.data.departamento ? this.data.departamento.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
    });
    // * segunto formulario
    this.formSecond = new UntypedFormGroup({
      localidad: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ),
      codigo_postal: new UntypedFormControl(
        this.data.codigo_postal ? this.data.codigo_postal : 0
      ),
      sub_codigo_postal: new UntypedFormControl(
        this.data.sub_codigo_postal ? this.data.sub_codigo_postal : 0
      ),
      nro_tel: new UntypedFormControl(
        this.data.nro_tel ? this.data.nro_tel.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      nro_fax: new UntypedFormControl(
        this.data.nro_fax ? this.data.nro_fax.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      email: new UntypedFormControl(
        this.data.email ? this.data.email.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
    });
    // * tercer formulario
    this.formThird = new UntypedFormGroup({
      codigo_iva: new UntypedFormControl(
        this.data.codigo_iva ? this.data.codigo_iva : '',
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      cuit: new UntypedFormControl(
        this.data.cuit ? this.data.cuit : '',
        Validators.compose([Validators.required, Validators.maxLength(11)])
      ),
      fecha_vto_cuit: new UntypedFormControl(
        this.data.fecha_vto_cuit ? this.data.fecha_vto_cuit : 0,
        Validators.compose([Validators.required, Validators.maxLength(8)])
      ),
      cta_banco_ams: new UntypedFormControl(
        this.data.cta_banco_ams ? this.data.cta_banco_ams : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
    });
    // * ultimo formulario
    this.formFinal = new UntypedFormGroup({
      comprobante_generar: new UntypedFormControl(
        this.data.comprobante_generar
          ? this.data.comprobante_generar.trim()
          : '',
        Validators.compose([Validators.required])
      ),
      trabaja_ref_cont: new UntypedFormControl(
        this.data.trabaja_ref_cont ? this.data.trabaja_ref_cont.trim() : '',
        Validators.compose([Validators.required])
      ),
      fact_cr_elec: new UntypedFormControl(
        this.data.fact_cr_elec ? this.data.fact_cr_elec.trim() : '',
        Validators.compose([Validators.required])
      ),
      modo: new UntypedFormControl(
        this.data.modo ? this.data.modo : ''
        // Validators.compose([Validators.required])
      ),

      // * datos sin front
      campo_desc1: new UntypedFormControl(
        this.data.campo_desc1 ? this.data.campo_desc1.trim() : ''
      ),
      campo_desc2: new UntypedFormControl(
        this.data.campo_desc2 ? this.data.campo_desc2.trim() : ''
      ),
      cbu_nro: new UntypedFormControl(
        this.data.cbu_nro ? this.data.cbu_nro.trim() : ''
      ),
      codigo_postal_arg: new UntypedFormControl(
        this.data.codigo_postal_arg ? this.data.codigo_postal_arg.trim() : ''
      ),
      codigo_sicone: new UntypedFormControl(
        this.data.codigo_sicone ? this.data.codigo_sicone.trim() : ''
      ),
      fecha_inicio_act: new UntypedFormControl(
        this.data.fecha_inicio_act ? this.data.fecha_inicio_act : 0,
      ),
      gen_min_como_empr: new UntypedFormControl(
        this.data.gen_min_como_empr ? this.data.gen_min_como_empr.trim() : 'S'
      ),
      moneda1: new UntypedFormControl(
        this.data.moneda1 ? this.data.moneda1 : 0
      ),
      moneda2: new UntypedFormControl(
        this.data.moneda2 ? this.data.moneda2 : 0
      ),
      nro_inscripcion_igb: new UntypedFormControl(
        this.data.nro_inscripcion_igb ? this.data.nro_inscripcion_igb : 0
      ),
      ref_contable_acreedora1: new UntypedFormControl(
        this.data.ref_contable_acreedora1
          ? this.data.ref_contable_acreedora1.trim()
          : ''
      ),
      ref_contable_acreedora2: new UntypedFormControl(
        this.data.ref_contable_acreedora2
          ? this.data.ref_contable_acreedora2.trim()
          : ''
      ),
    });
  }

  loadLocalidad() {
    this.localidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'L',
          codigo_postal: this.data.codigo_postal,
          sub_codigo_postal: this.data.sub_codigo_postal,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.formSecond
            .get('localidad')
            ?.setValue(res.dataset.descripcion.trim());
        },
        error: (err: any) => {
          err.status == 0
            ? this.utils.notification('Error de conexión. ', 'error')
            : this.utils.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                'error'
              );
        },
      });
  }

  private setFormValues(): void {}

  // * envia los datos a Datos Comercio
  public datosComercio(): void {}

  // * envia los datos a pago Link
  public pagoLink() {}

  // * limpia los datos de las localidad
  public searchLocalidad(): void {
    const modalSetLocalidad = this.dialog.open(ModalLocalidadComponent, {
      data: {
        title: 'SELECCIONE UNA LOCALIDAD',
        edit: true,
        codigo_postal: this.data.codigo_postal,
        sub_codigo_postal: this.data.sub_codigo_postal,
      },
    });
    modalSetLocalidad.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.formSecond.get('localidad')?.setValue(res.descripcion);
          this.formSecond.get('codigo_postal')?.setValue(res.codigo_postal);
          this.formSecond
            .get('sub_codigo_postal')
            ?.setValue(res.sub_codigo_postal);
        }
      },
    });
  }

  public clear(): void {
    this.formSecond.get('localidad')?.setValue('');
    this.formSecond.get('codigo_postal')?.setValue('');
    this.formSecond.get('sub_codigo_postal')?.setValue('');
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    if (
      this.formInitial.valid &&
      this.formSecond.valid &&
      this.formThird.valid &&
      this.formFinal.valid
    ) {
      this.dialogRef.close({
        empresa: {
          par_modo: this.data.par_modo,
          id_empresa: this.formInitial.get('id_empresa')?.value
            ? this.formInitial.get('id_empresa')?.value
            : 0,
          descripcion: this.formInitial.get('descripcion')?.value,
          calle: this.formInitial.get('calle')?.value,
          nro_puerta: parseInt(this.formInitial.get('nro_puerta')?.value),
          piso: parseInt(this.formInitial.get('piso')?.value),
          departamento: this.formInitial.get('departamento')?.value,

          codigo_postal: parseInt(this.formSecond.get('codigo_postal')?.value),
          sub_codigo_postal: parseInt(
            this.formSecond.get('sub_codigo_postal')?.value
          ),
          nro_tel: this.formSecond.get('nro_tel')?.value,
          nro_fax: this.formSecond.get('nro_fax')?.value,
          email: this.formSecond.get('email')?.value,

          codigo_iva: parseInt(this.formThird.get('codigo_iva')?.value),
          cuit: parseInt(this.formThird.get('cuit')?.value),
          fecha_vto_cuit: parseInt(this.formThird.get('fecha_vto_cuit')?.value),
          cta_banco_ams: this.formThird.get('cta_banco_ams')?.value,

          comprobante_generar: this.formFinal.get('comprobante_generar')?.value,
          trabaja_ref_cont: this.formFinal.get('trabaja_ref_cont')?.value,
          fact_cr_elec: this.formFinal.get('fact_cr_elec')?.value,

          // * datos para el back end
          campo_desc1: this.formFinal.get('campo_desc1')?.value,
          campo_desc2: this.formFinal.get('campo_desc2')?.value,
          cbu_nro: this.formFinal.get('cbu_nro')?.value,
          codigo_postal_arg: this.formFinal.get('codigo_postal_arg')?.value,
          codigo_sicone: this.formFinal.get('codigo_sicone')?.value,
          fecha_inicio_act: parseInt(this.formFinal.get('fecha_inicio_act')?.value),
          gen_min_como_empr: this.formFinal.get('gen_min_como_empr')?.value,
          moneda1: parseInt(this.formFinal.get('moneda1')?.value),
          moneda2: parseInt(this.formFinal.get('moneda2')?.value),
          nro_inscripcion_igb: this.formFinal.get('nro_inscripcion_igb')?.value,
          ref_contable_acreedora1: this.formFinal.get('ref_contable_acreedora1')
            ?.value,
          ref_contable_acreedora2: this.formFinal.get('ref_contable_acreedora2')
            ?.value,
        },
        modo: {
          modo: this.formFinal.get('modo')?.value,
        },
      });
    }
  }
}

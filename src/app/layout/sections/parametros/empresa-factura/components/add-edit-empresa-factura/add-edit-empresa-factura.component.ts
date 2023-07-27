import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// * Forms
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// * Interface
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

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
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalLocalidadComponent } from './modal-localidad/modal-localidad.component';

@Component({
  selector: 'app-add-edit-empresa-factura',
  templateUrl: './add-edit-empresa-factura.component.html',
  styleUrls: ['./add-edit-empresa-factura.component.scss'],
  providers: [DatePipe],
})
export class AddEditEmpresaFacturaComponent {
  empresaFactura: IEmpresaFactura[];
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public listaModo: IEmpresaFactura;
  public activeTabIndex = 0;
  public icon: string;
  public errorFecha: boolean = false;
  fecha_hoy: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private UtilService: UtilService,
    private dialog: MatDialog,
    public empresaFacturaService: EmpresaFacturaService,
    public localidadService: LocalidadService,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const fechaEndPicker = this.calcularFecha(new Date());
    this.fecha_hoy = this.datePipe
      .transform(fechaEndPicker, 'yyyy-MM-dd')
      ?.toString();
    this.setUpForm();
  }

  ngOnInit() {
    if (this.data.id_empresa !== undefined) {
      this.setFormValues();
      this.loadModo();
      if (this.data.par_modo === 'R' && this.data.edit !== true) {
        this.formGroup.disable();
      }
      this.formGroup.get('id_empresa')?.disable();
      this.loadLocalidad();
    }
  }

  // * carga de la lista
  private loadModo(): void {
    this.UtilService.openLoading();
    this.empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'E',
          id_empresa: this.data.id_empresa,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.formGroup.get('modo')?.setValue(res.dataset.modo);
        },
        error: (err: any) => {
          this.UtilService.closeLoading();
        },
        complete: () => {},
      });
  }

  // * carga los formularios
  private setUpForm(): void {
    // * primer formulario
    this.formGroup = new UntypedFormGroup({
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
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      piso: new UntypedFormControl(
        this.data.piso ? this.data.piso : '',
        Validators.compose([Validators.maxLength(2), isNumeric()])
      ),
      departamento: new UntypedFormControl(
        this.data.departamento ? this.data.departamento.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
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
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
          this.validarCorreo(),
        ])
      ),
      codigo_iva: new UntypedFormControl(
        this.data.codigo_iva ? this.data.codigo_iva : '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      cuit: new UntypedFormControl(
        this.data.cuit ? this.data.cuit : '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(11),
          isNumeric(),
        ])
      ),
      fecha_vto_cuit: new UntypedFormControl(
        this.data.fecha_vto_cuit != '0'
          ? this.calcularValor(this.data.fecha_vto_cuit)
          : this.data.fecha_vto_cuit,
        Validators.compose([Validators.required, this.vigenciaFecha()])
      ),
      cta_banco_ams: new UntypedFormControl(
        this.data.cta_banco_ams ? this.data.cta_banco_ams.trim() : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
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
      modo: new UntypedFormControl(this.data.modo ? this.data.modo : '0'),

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
        this.data.fecha_inicio_act ? this.data.fecha_inicio_act.trim() : 0
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
          this.formGroup
            .get('localidad')
            ?.setValue(res.dataset.descripcion.trim());
        },
        error: (err: any) => {
          this.UtilService.closeLoading();
          err.status == 0
            ? this.UtilService.notification('Error de conexión. ', 'error')
            : this.UtilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                'error'
              );
        },
        complete: () => {
          this.UtilService.closeLoading();
        },
      });
  }

  private setFormValues(): void {
    this.formGroup
      .get('email')
      ?.setValue(this.data.email ? this.data.email.trim() : '');
    this.formGroup
      .get('fecha_vto_cuit')
      ?.setValue(
        this.data.fecha_vto_cuit
          ? this.calcularValor(this.data.fecha_vto_cuit)
          : this.data.fecha_vto_cuit
      );
  }

  // * envia los datos para Datos Comercio y pago Link
  public redirectTo(url: string): void {
    this.empresaFacturaService.set([this.data]);
    this.empresaFacturaService.setBack(false);
    this.router.navigate([url]);
  }
  // * busca los datos de las localidad
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
          this.formGroup.get('localidad')?.setValue(res.descripcion);
          this.formGroup.get('codigo_postal')?.setValue(res.codigo_postal);
          this.formGroup
            .get('sub_codigo_postal')
            ?.setValue(res.sub_codigo_postal);
        }
      },
    });
  }
  // * limpa los datos de localidad
  public clear(): void {
    this.formGroup.get('localidad')?.setValue('');
    this.formGroup.get('codigo_postal')?.setValue('');
    this.formGroup.get('sub_codigo_postal')?.setValue('');
  }

  validarCorreo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const correo = control.value;
      if (correo != '') {
        if (!correo.includes('@') || !correo.includes('.')) {
          return {
            error:
              'Ingrese un correo electrónico válido. Ej: ejemplo@gmail.com',
          };
        }
      }
      return null;
    };
  }

  vigenciaFecha(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fecha = control.value,
        fecha_hoy = this.calcularFecha(new Date());
      if (fecha != 0 && fecha < fecha_hoy) {
        return {
          error: 'La fecha ha expirado.',
        };
      }
      return null;
    };
  }

  private calcularFecha(fecha: Date) {
    return (
      fecha.getFullYear() +
      '-' +
      (fecha.getMonth() + 1) +
      '-' +
      (fecha.getDate() + 1)
    );
  }

  public calcularValor(fecha: number) {
    const newFecha = fecha.toString();
    if (fecha !== null) {
      const dateFecha = new Date(
        newFecha.slice(0, 4) +
          '-' +
          newFecha.slice(4, 6) +
          '-' +
          newFecha.slice(6, 8)
      );
      return this.datePipe.transform(
        this.calcularFecha(dateFecha),
        'yyyy-MM-dd'
      );
    } else {
      return this.data.fecha_vto_cuit;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close({
        empresa: {
          par_modo: this.data.par_modo,
          id_empresa: this.formGroup.get('id_empresa')?.value
            ? this.formGroup.get('id_empresa')?.value
            : 0,
          descripcion: this.formGroup.get('descripcion')?.value,
          calle: this.formGroup.get('calle')?.value,
          nro_puerta: parseInt(this.formGroup.get('nro_puerta')?.value),
          piso: parseInt(this.formGroup.get('piso')?.value),
          departamento: this.formGroup.get('departamento')?.value,

          codigo_postal: parseInt(this.formGroup.get('codigo_postal')?.value),
          sub_codigo_postal: parseInt(
            this.formGroup.get('sub_codigo_postal')?.value
          ),
          nro_tel: this.formGroup.get('nro_tel')?.value,
          nro_fax: this.formGroup.get('nro_fax')?.value,
          email: this.formGroup.get('email')?.value,

          codigo_iva: parseInt(this.formGroup.get('codigo_iva')?.value),
          cuit: parseInt(this.formGroup.get('cuit')?.value),
          fecha_vto_cuit: this.datePipe.transform(
            this.calcularFecha(
              new Date(this.formGroup.get('fecha_vto_cuit')?.value)
            ),
            'yyyyMMdd'
          ),
          cta_banco_ams: this.formGroup.get('cta_banco_ams')?.value,

          comprobante_generar: this.formGroup.get('comprobante_generar')?.value,
          trabaja_ref_cont: this.formGroup.get('trabaja_ref_cont')?.value,
          fact_cr_elec: this.formGroup.get('fact_cr_elec')?.value,

          // * datos para el back end
          campo_desc1: this.formGroup.get('campo_desc1')?.value,
          campo_desc2: this.formGroup.get('campo_desc2')?.value,
          cbu_nro: this.formGroup.get('cbu_nro')?.value,
          codigo_postal_arg: this.formGroup.get('codigo_postal_arg')?.value,
          codigo_sicone: this.formGroup.get('codigo_sicone')?.value,
          fecha_inicio_act: this.formGroup.get('fecha_inicio_act')?.value
            ? this.formGroup.get('fecha_inicio_act')?.value
            : '0',
          gen_min_como_empr: this.formGroup.get('gen_min_como_empr')?.value,
          moneda1: parseInt(this.formGroup.get('moneda1')?.value),
          moneda2: parseInt(this.formGroup.get('moneda2')?.value),
          nro_inscripcion_igb: this.formGroup.get('nro_inscripcion_igb')?.value,
          ref_contable_acreedora1: this.formGroup.get('ref_contable_acreedora1')
            ?.value,
          ref_contable_acreedora2: this.formGroup.get('ref_contable_acreedora2')
            ?.value,
        },
        modo: {
          modo: this.formGroup.get('modo')?.value,
        },
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}

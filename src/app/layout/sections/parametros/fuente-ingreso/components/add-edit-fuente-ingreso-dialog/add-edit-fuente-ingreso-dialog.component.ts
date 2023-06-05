import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Validations
import { getErrorMessage } from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-fuente-ingreso-dialog',
  templateUrl: './add-edit-fuente-ingreso-dialog.component.html',
  styleUrls: ['./add-edit-fuente-ingreso-dialog.component.scss'],
})
export class AddEditFuenteIngresoDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  listEmpresas: any;
  listConceptos: any;
  listComprobantes: any;
  listTalonarios: any;
  listCondicionV: any;
  listReferencia: any;

  dias: any[];
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private utils: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fuentesIngresoService: FuenteIngresoService
  ) {
    this.dias = [
      { d: 1, dia: 1 },
      { d: 2, dia: 2 },
      { d: 3, dia: 3 },
      { d: 4, dia: 4 },
      { d: 5, dia: 5 },
      { d: 6, dia: 6 },
      { d: 7, dia: 7 },
      { d: 8, dia: 8 },
      { d: 9, dia: 9 },
      { d: 10, dia: 10 },
      { d: 11, dia: 11 },
      { d: 12, dia: 12 },
      { d: 13, dia: 13 },
      { d: 14, dia: 14 },
      { d: 15, dia: 15 },
      { d: 16, dia: 16 },
      { d: 17, dia: 17 },
      { d: 18, dia: 18 },
      { d: 19, dia: 19 },
      { d: 20, dia: 20 },
      { d: 21, dia: 21 },
      { d: 22, dia: 22 },
      { d: 23, dia: 23 },
      { d: 24, dia: 24 },
      { d: 25, dia: 25 },
      { d: 26, dia: 26 },
      { d: 27, dia: 27 },
      { d: 28, dia: 28 },
    ];
  }

  ngOnInit(): void {
    this.listEmpresas = this.cargaDatos('E', 'listEmpresas');
    this.listConceptos = this.cargaDatos('A', 'listConceptos');
    this.listComprobantes = this.cargaDatos('B', 'listComprobantes');
    this.listTalonarios = this.cargaDatos('H', 'listTalonarios');
    this.listCondicionV = this.cargaDatos('G', 'listCondicionV');
    this.setUpForm();
    if (this.data.codigo_fuente_ingreso) this.setFormValues();
  }

  cargaDatos(dato: string, consulta: string) {
    let body = {
      par_modo: dato,
    };
    console.log(dato);
    this.fuentesIngresoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        switch (consulta) {
          case 'listEmpresas': {
            this.listEmpresas = res.dataset;
            break;
          }
          case 'listConceptos': {
            this.listConceptos = res.dataset;
            break;
          }
          case 'listComprobantes': {
            this.listComprobantes = res.dataset;
            break;
          }
          case 'listTalonarios': {
            this.listTalonarios = res.dataset;
            break;
          }
          case 'listCondicionV': {
            this.listCondicionV = res.dataset;
            break;
          }
        }
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

  cargaReferencia(dato: string) {
    let body = {
      par_modo: 'J',
      empresa_asociada: dato,
    };
    this.fuentesIngresoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        this.listReferencia = res.dataset;
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

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_fuente_ingreso: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo == 'U' },
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      tipo_fuente: new UntypedFormControl(
        'A',
        Validators.compose([Validators.required])
      ),
      codigo_fuente_admin: new UntypedFormControl(' '),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      descripcion_reducida: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      solicita_ref: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      dia_corte: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      empresa_asociada: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(8)])
      ),
      nro_solicitud: new UntypedFormControl('0', Validators.compose([])),
      fecha_ultima_liquidacion: new UntypedFormControl(
        20161123,
        Validators.compose([Validators.maxLength(8)])
      ),
      aporte_adicional: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      fuente_aporte_adicional: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(5)])
      ),
      concepto_aporte_adicional: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(5)])
      ),
      controla_dec_jur: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      comprobante_general: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(4)])
      ),
      condicion_venta: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
      sub_prog_calc: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(10)])
      ),
      ref_contable_asociada: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(11)])
      ),
      concepto_aporte: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      concepto_arancel: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      agrupa_entidades: new UntypedFormControl(
        0,
        Validators.compose([Validators.required])
      ),
      grupo_familiar_imprimir: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(2)])
      ),
      numeracion_auto: new UntypedFormControl('N', Validators.compose([])),
      talonario: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      liquida_punitorio: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      liquida_reintegro: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      liquida_planes_mix: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      liquida_planes_monotributo: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      selecciona_productos_liq: new UntypedFormControl(
        'N',
        Validators.compose([])
      ),
      condicion_aporte_adic_dec: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(5)])
      ),
      agrupador_capita: new UntypedFormControl(
        0,
        Validators.compose([Validators.maxLength(5)])
      ),
      liquidacion_mensual: new UntypedFormControl('N', Validators.compose([])),
      condicion_venta_venc: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
      condicion_venta_dos_venc: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('codigo_fuente_ingreso')
      ?.setValue(this.data.codigo_fuente_ingreso),
      this.formGroup.get('tipo_fuente')?.setValue(this.data.tipo_fuente),
      this.formGroup.get('descripcion')?.setValue(this.data.descripcion),
      this.formGroup
        .get('descripcion_reducida')
        ?.setValue(this.data.descripcion_reducida),
      this.formGroup.get('solicita_ref')?.setValue(this.data.solicita_ref),
      this.formGroup.get('dia_corte')?.setValue(this.data.dia_corte),
      this.formGroup
        .get('empresa_asociada')
        ?.setValue(this.data.empresa_asociada),
      this.formGroup.get('nro_solicitud')?.setValue(this.data.nro_solicitud),
      this.formGroup
        .get('fecha_ultima_liquidacion')
        ?.setValue(this.data.fecha_ultima_liquidacion),
      this.formGroup
        .get('aporte_adicional')
        ?.setValue(this.data.aporte_adicional),
      this.formGroup
        .get('fuente_aporte_adicional')
        ?.setValue(this.data.fuente_aporte_adicional),
      this.formGroup
        .get('concepto_aporte_adicional')
        ?.setValue(this.data.concepto_aporte_adicional),
      this.formGroup
        .get('controla_dec_jur')
        ?.setValue(this.data.controla_dec_jur),
      this.formGroup
        .get('comprobante_general')
        ?.setValue(this.data.comprobante_general),
      this.formGroup
        .get('condicion_venta')
        ?.setValue(this.data.condicion_venta),
      this.formGroup.get('sub_prog_calc')?.setValue(this.data.sub_prog_calc),
      this.formGroup
        .get('ref_contable_asociada')
        ?.setValue(this.data.ref_contable_asociada),
      this.formGroup
        .get('concepto_aporte')
        ?.setValue(this.data.concepto_aporte),
      this.formGroup
        .get('concepto_arancel')
        ?.setValue(this.data.concepto_arancel),
      this.formGroup
        .get('agrupa_entidades')
        ?.setValue(this.data.agrupa_entidades),
      this.formGroup
        .get('grupo_familiar_imprimir')
        ?.setValue(this.data.grupo_familiar_imprimir),
      this.formGroup
        .get('numeracion_auto')
        ?.setValue(this.data.numeracion_auto),
      this.formGroup.get('talonario')?.setValue(this.data.talonario),
      this.formGroup
        .get('liquida_punitorio')
        ?.setValue(this.data.liquida_punitorio),
      this.formGroup
        .get('liquida_reintegro')
        ?.setValue(this.data.liquida_reintegro),
      this.formGroup
        .get('liquida_planes_mix')
        ?.setValue(this.data.liquida_planes_mix),
      this.formGroup
        .get('liquida_planes_monotributo')
        ?.setValue(this.data.liquida_planes_monotributo),
      this.formGroup
        .get('selecciona_productos_liq')
        ?.setValue(this.data.selecciona_productos_liq),
      this.formGroup
        .get('condicion_aporte_adic_dec')
        ?.setValue(this.data.condicion_aporte_adic_dec),
      this.formGroup
        .get('agrupador_capita')
        ?.setValue(this.data.agrupador_capita),
      this.formGroup
        .get('liquidacion_mensual')
        ?.setValue(this.data.liquidacion_mensual),
      this.formGroup
        .get('condicion_venta_venc')
        ?.setValue(this.data.condicion_venta_venc),
      this.formGroup
        .get('condicion_venta_dos_venc')
        ?.setValue(this.data.condicion_venta_dos_venc);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_fuente_ingreso: parseInt(
          this.formGroup.get('codigo_fuente_ingreso')?.value
        ),
        tipo_fuente: this.formGroup.get('tipo_fuente')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        solicita_ref: this.formGroup.get('solicita_ref')?.value,
        dia_corte: this.formGroup.get('dia_corte')?.value,
        empresa_asociada: this.formGroup.get('empresa_asociada')?.value,
        nro_solicitud: this.formGroup.get('nro_solicitud')?.value,
        fecha_ultima_liquidacion: this.formGroup.get('fecha_ultima_liquidacion')
          ?.value,
        aporte_adicional: this.formGroup.get('aporte_adicional')?.value,
        fuente_aporte_adicional: this.formGroup.get('fuente_aporte_adicional')
          ?.value,
        concepto_aporte_adicional: this.formGroup.get(
          'concepto_aporte_adicional'
        )?.value,
        controla_dec_jur: this.formGroup.get('controla_dec_jur')?.value,
        comprobante_general: this.formGroup.get('comprobante_general')?.value,
        condicion_venta: this.formGroup.get('condicion_venta')?.value,
        sub_prog_calc: this.formGroup.get('sub_prog_calc')?.value,
        ref_contable_asociada: this.formGroup.get('ref_contable_asociada')
          ?.value,
        concepto_aporte: this.formGroup.get('concepto_aporte')?.value,
        concepto_arancel: this.formGroup.get('concepto_arancel')?.value,
        agrupa_entidades: this.formGroup.get('agrupa_entidades')?.value,
        grupo_familiar_imprimir: this.formGroup.get('grupo_familiar_imprimir')
          ?.value,
        numeracion_auto: this.formGroup.get('numeracion_auto')?.value,
        talonario: this.formGroup.get('talonario')?.value,
        liquida_punitorio: this.formGroup.get('liquida_punitorio')?.value,
        liquida_reintegro: this.formGroup.get('liquida_reintegro')?.value,
        liquida_planes_mix: this.formGroup.get('liquida_planes_mix')?.value,
        liquida_planes_monotributo: this.formGroup.get(
          'liquida_planes_monotributo'
        )?.value,
        selecciona_productos_liq: this.formGroup.get('selecciona_productos_liq')
          ?.value,
        condicion_aporte_adic_dec: this.formGroup.get(
          'condicion_aporte_adic_dec'
        )?.value,
        agrupador_capita: this.formGroup.get('agrupador_capita')?.value,
        liquidacion_mensual: this.formGroup.get('liquidacion_mensual')?.value,
        condicion_venta_venc: this.formGroup.get('condicion_venta_venc')?.value,
        condicion_venta_dos_venc: this.formGroup.get('condicion_venta_dos_venc')
          ?.value,
      });
    }
  }
}

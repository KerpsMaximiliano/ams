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
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalFuenteIngresoComponent } from './modal-fuente-ingreso/modal-fuente-ingreso.component';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { concat, merge, toArray } from 'rxjs';

@Component({
  selector: 'app-add-edit-fuente-ingreso-dialog',
  templateUrl: './add-edit-fuente-ingreso-dialog.component.html',
  styleUrls: ['./add-edit-fuente-ingreso-dialog.component.scss'],
})
export class AddEditFuenteIngresoDialogComponent {
  fuenteIngresos: IFuenteIngreso[];
  public formInitial: UntypedFormGroup;
  public formSecond: UntypedFormGroup;
  public formFinal: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  listEmpresas: { descripcion: string; id_empresa: number }[];
  listConceptos: { id_concepto: number; descripcion: string }[];
  listComprobantes: { id_comprobante: string; descripcion: string }[];
  listTalonarios: { id_talonario: number; numero: number }[];
  listCondicionV: { id_condicion: number; descripcion: string }[];
  listReferencia: {
    descripcion: string;
    id_empresaAsoc: number;
    id_referencia_contable: string;
  }[];
  mostrarAdministradora: boolean = false;

  dias: { d: number; dia: number }[];
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private utils: UtilService,
    private dialog: MatDialog,
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
    this.cargaDatos();
    // this.cargaDatos('A', 'listConceptos');
    // this.cargaDatos('B', 'listComprobantes');
    // this.cargaDatos('H', 'listTalonarios');
    // this.cargaDatos('G', 'listCondicionV');
  }

  ngOnInit() {
    this.setUpForm();
    if (this.data.codigo_fuente_ingreso !== undefined) {
      this.setFormValues();
      if (this.data.par_modo === 'C' && this.data.edit !== true) {
        this.formInitial.disable();
        this.formSecond.disable();
        this.formFinal.disable();
      }
      this.formInitial.get('codigo_fuente_ingreso')?.disable();
    }
    this.getFuenteIngreso();
  }

  // * crea una lista con las fuente de ingreso
  private getFuenteIngreso(): void {
    this.utils.openLoading();
    let body = {
      par_modo: 'O',
      descripcion: '',
      desc_empresa: '',
    };
    this.fuentesIngresoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        this.fuenteIngresos = res.dataset as IFuenteIngreso[];
        this.filtroFuente();
      },
      error: (err: any) => {
        this.utils.closeLoading();
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
      },
    });
  }

  // * cambia el codigo de la fuente (administracion o adicional) por la descripcion
  public filtroFuente(): void {
    this.formInitial.get('codigo_fuente_admin')?.value != 0
      ? this.formInitial
          .get('codigo_fuente_admin_descripcion')
          ?.setValue(
            this.fuenteIngresos.find(
              (filtro) =>
                filtro.codigo_fuente_ingreso ==
                this.formInitial.get('codigo_fuente_admin')?.value
            )?.descripcion
          )
      : '';
    this.formFinal.get('fuente_aporte_adicional')?.value != 0
      ? this.formFinal
          .get('fuente_aporte_adicional_descripcion')
          ?.setValue(
            this.fuenteIngresos.find(
              (filtro) =>
                filtro.codigo_fuente_ingreso ==
                this.formFinal.get('fuente_aporte_adicional')?.value
            )?.descripcion
          )
      : '';
  }

  // * carga de las lista
  private cargaDatos(): void {
    concat(
      this.fuentesIngresoService.CRUD(JSON.stringify({ par_modo: 'E' })),
      this.fuentesIngresoService.CRUD(JSON.stringify({ par_modo: 'A' })),
      this.fuentesIngresoService.CRUD(JSON.stringify({ par_modo: 'B' })),
      this.fuentesIngresoService.CRUD(JSON.stringify({ par_modo: 'H' })),
      this.fuentesIngresoService.CRUD(JSON.stringify({ par_modo: 'G' }))
    )
      .pipe(toArray())
      .subscribe({
        next: (res: any) => {
          // * listEmpresas
          this.listEmpresas = res[0].dataset;
          // * listConceptos
          this.listConceptos = res[1].dataset;
          // * listComprobantes
          this.listComprobantes = res[2].dataset;
          // * listTalonarios
          this.listTalonarios = res[3].dataset;
          // * listCondicionV
          this.listCondicionV = res[4].dataset;
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

  // * carga de las lista de referencias de empresas
  public cargaReferencia(dato: number): void {
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

  // * carga los formularios
  private setUpForm(): void {
    // * primer formulario
    this.formInitial = new UntypedFormGroup({
      codigo_fuente_ingreso: new UntypedFormControl(
        this.data.codigo_fuente_ingreso ? this.data.codigo_fuente_ingreso : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([Validators.required])
      ),
      descripcion_reducida: new UntypedFormControl(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      tipo_fuente: new UntypedFormControl(
        this.data.tipo_fuente ? this.data.tipo_fuente.trim() : '',
        Validators.compose([Validators.required])
      ),
      codigo_fuente_admin: new UntypedFormControl(
        this.data.codigo_fuente_admin ? this.data.codigo_fuente_admin : ''
      ),
      codigo_fuente_admin_descripcion: new UntypedFormControl(),
      empresa_asociada: new UntypedFormControl(
        this.data.empresa_asociada ? this.data.empresa_asociada : '',
        Validators.compose([Validators.required, Validators.maxLength(8)])
      ),
      solicita_ref: new UntypedFormControl(
        this.data.solicita_ref ? this.data.solicita_ref.trim() : '',
        Validators.compose([Validators.required])
      ),
      dia_corte: new UntypedFormControl(
        this.data.dia_corte ? this.data.dia_corte : 1,
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      controla_dec_jur: new UntypedFormControl(
        this.data.controla_dec_jur ? this.data.controla_dec_jur.trim() : '',
        Validators.compose([Validators.required])
      ),
    });
    // * segunto formulario
    this.formSecond = new UntypedFormGroup({
      concepto_aporte: new UntypedFormControl(
        this.data.concepto_aporte ? this.data.concepto_aporte : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      concepto_arancel: new UntypedFormControl(
        this.data.concepto_arancel ? this.data.concepto_arancel : '',
        Validators.compose([Validators.required, Validators.maxLength(5)])
      ),
      condicion_venta: new UntypedFormControl(
        this.data.condicion_venta ? this.data.condicion_venta : '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
      ref_contable_asociada: new UntypedFormControl(
        this.data.ref_contable_asociada ? this.data.ref_contable_asociada : '',
        Validators.compose([Validators.required, Validators.maxLength(11)])
      ),
      comprobante_general: new UntypedFormControl(
        this.data.comprobante_general
          ? this.data.comprobante_general.trim()
          : '',
        Validators.compose([Validators.required, Validators.maxLength(4)])
      ),
      talonario: new UntypedFormControl(
        this.data.talonario ? this.data.talonario : '',
        Validators.compose([Validators.required, Validators.maxLength(2)])
      ),
      condicion_venta_venc: new UntypedFormControl(
        this.data.condicion_venta_venc ? this.data.condicion_venta_venc : '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
      condicion_venta_dos_venc: new UntypedFormControl(
        this.data.condicion_venta_dos_venc
          ? this.data.condicion_venta_dos_venc
          : '',
        Validators.compose([Validators.required, Validators.maxLength(3)])
      ),
    });
    // * ultimo formulario
    this.formFinal = new UntypedFormGroup({
      liquida_punitorio: new UntypedFormControl(
        this.data.liquida_punitorio ? this.data.liquida_punitorio.trim() : '',
        Validators.compose([Validators.required])
      ),
      liquida_reintegro: new UntypedFormControl(
        this.data.liquida_reintegro ? this.data.liquida_reintegro.trim() : '',
        Validators.compose([Validators.required])
      ),
      liquida_planes_mix: new UntypedFormControl(
        this.data.liquida_planes_mix ? this.data.liquida_planes_mix.trim() : '',
        Validators.compose([Validators.required])
      ),
      liquida_planes_monotributo: new UntypedFormControl(
        this.data.liquida_planes_monotributo
          ? this.data.liquida_planes_monotributo.trim()
          : '',
        Validators.compose([Validators.required])
      ),
      aporte_adicional: new UntypedFormControl(
        this.data.aporte_adicional ? this.data.aporte_adicional.trim() : '',
        Validators.compose([Validators.required])
      ),
      agrupa_entidades: new UntypedFormControl(
        this.data.agrupa_entidades ? this.data.agrupa_entidades.trim() : '',
        Validators.compose([Validators.required])
      ),
      condicion_aporte_adic_dec: new UntypedFormControl(
        this.data.condicion_aporte_adic_dec
          ? this.data.condicion_aporte_adic_dec
          : '',
        Validators.compose([Validators.maxLength(5)])
      ),
      fuente_aporte_adicional: new UntypedFormControl(
        this.data.fuente_aporte_adicional
          ? this.data.fuente_aporte_adicional
          : '',
        Validators.compose([Validators.maxLength(5)])
      ),
      fuente_aporte_adicional_descripcion: new UntypedFormControl(),
      concepto_aporte_adicional: new UntypedFormControl(
        this.data.concepto_aporte_adicional
          ? this.data.concepto_aporte_adicional
          : '',
        Validators.compose([Validators.maxLength(5)])
      ),

      // * datos sin front
      nro_solicitud: new UntypedFormControl(
        this.data.nro_solicitud ? this.data.nro_solicitud : '',
        Validators.compose([])
      ),
      fecha_ultima_liquidacion: new UntypedFormControl(
        this.data.fecha_ultima_liquidacion
          ? this.data.fecha_ultima_liquidacion
          : '',
        Validators.compose([Validators.maxLength(8)])
      ),
      sub_prog_calc: new UntypedFormControl(
        this.data.sub_prog_calc ? this.data.sub_prog_calc.trim() : '',
        Validators.compose([Validators.maxLength(10)])
      ),
      grupo_familiar_imprimir: new UntypedFormControl(
        this.data.grupo_familiar_imprimir
          ? this.data.grupo_familiar_imprimir.trim()
          : '',
        Validators.compose([Validators.maxLength(2)])
      ),
      numeracion_auto: new UntypedFormControl('', Validators.compose([])),
      selecciona_productos_liq: new UntypedFormControl(
        this.data.selecciona_productos_liq
          ? this.data.selecciona_productos_liq.trim()
          : '',
        Validators.compose([])
      ),
      agrupador_capita: new UntypedFormControl(
        this.data.agrupador_capita ? this.data.agrupador_capita : '',
        Validators.compose([Validators.maxLength(5)])
      ),
      liquidacion_mensual: new UntypedFormControl('', Validators.compose([])),
    });
  }

  // * valida los datos de la fuente de administracion
  public fuenteAdministradora() {
    if (this.formInitial.get('tipo_fuente')?.value == 'A') {
      this.formInitial.get('codigo_fuente_admin')?.setValue(0);
      this.formInitial.get('codigo_fuente_admin_descripcion')?.setValue('');
      this.mostrarAdministradora = false;
    } else if (this.formInitial.get('tipo_fuente')?.value != 'A') {
      this.mostrarAdministradora = true;
    }
  }

  private setFormValues(): void {}

  // * envia los datos para CU 32
  public coeficiente(): void {
    let datos;
    datos = {};
    // * descomentar para enviar datos al CU 32
    // this._unificadorAportes.set(data);
    // this.dialogRef.close(false);
    // this.router.navigateByUrl('/parametros/unificacion-aportes');
  }

  // * envia los datos para CU 31
  public atributo() {
    let datos;
    datos = {};
    // * descomentar para enviar datos al CU 31
    // this._unificadorAportes.set(data);
    // this.dialogRef.close(false);
    // this.router.navigateByUrl('/parametros/unificacion-aportes');
  }

  // * recupera los datos de las fuentes (administradora y adicional) del modal
  public getFuente(tipo: string): void {
    const modalFuenteIngreso = this.dialog.open(ModalFuenteIngresoComponent, {
      data: {
        datos: this.fuenteIngresos,
      },
    });
    modalFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          if (tipo == 'administrado') {
            this.formInitial
              .get('codigo_fuente_admin')
              ?.setValue(res.codigo_fuente_ingreso);
          }
          if (tipo == 'adicional') {
            this.formFinal
              .get('fuente_aporte_adicional')
              ?.setValue(res.codigo_fuente_ingreso);
          }
          this.filtroFuente();
        }
      },
    });
  }

  // * limpia los datos de las fuentes (administradora y adicional)
  public limpiar(tipo: string): void {
    if (tipo == 'administrado') {
      this.formInitial.get('codigo_fuente_admin')?.setValue(0);
      this.formInitial.get('codigo_fuente_admin_descripcion')?.setValue('');
    }
    if (tipo == 'adicional') {
      this.formFinal.get('fuente_aporte_adicional')?.setValue(0);
      this.formFinal.get('fuente_aporte_adicional_descripcion')?.setValue('');
    }
    this.filtroFuente();
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    if (
      this.formInitial.valid &&
      this.formSecond.valid &&
      this.formFinal.valid
    ) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_fuente_ingreso: parseInt(
          this.formInitial.get('codigo_fuente_ingreso')?.value
        ),
        descripcion: this.formInitial.get('descripcion')?.value,
        descripcion_reducida: this.formInitial.get('descripcion_reducida')
          ?.value,
        tipo_fuente: this.formInitial.get('tipo_fuente')?.value,
        codigo_fuente_admin: this.formInitial.get('codigo_fuente_admin')?.value
          ? parseInt(this.formInitial.get('codigo_fuente_admin')?.value)
          : parseInt(this.formInitial.get('codigo_fuente_ingreso')?.value),
        empresa_asociada: this.formInitial.get('empresa_asociada')?.value,
        solicita_ref: this.formInitial.get('solicita_ref')?.value,
        dia_corte: this.formInitial.get('dia_corte')?.value,
        controla_dec_jur: this.formInitial.get('controla_dec_jur')?.value,

        concepto_aporte: this.formSecond.get('concepto_aporte')?.value,
        condicion_venta: this.formSecond.get('condicion_venta')?.value,
        concepto_arancel: this.formSecond.get('concepto_arancel')?.value,
        comprobante_general: this.formSecond.get('comprobante_general')?.value,
        ref_contable_asociada: this.formSecond.get('ref_contable_asociada')
          ?.value,
        talonario: this.formSecond.get('talonario')?.value,
        condicion_venta_venc: this.formSecond.get('condicion_venta_venc')
          ?.value,
        condicion_venta_dos_venc: this.formSecond.get(
          'condicion_venta_dos_venc'
        )?.value,

        liquida_punitorio: this.formFinal.get('liquida_punitorio')?.value,
        liquida_reintegro: this.formFinal.get('liquida_reintegro')?.value,
        liquida_planes_mix: this.formFinal.get('liquida_planes_mix')?.value,
        liquida_planes_monotributo: this.formFinal.get(
          'liquida_planes_monotributo'
        )?.value,
        agrupa_entidades: this.formFinal.get('agrupa_entidades')?.value,
        aporte_adicional: this.formFinal.get('aporte_adicional')?.value,
        fuente_aporte_adicional: this.formFinal.get('fuente_aporte_adicional')
          ?.value,
        concepto_aporte_adicional: this.formFinal.get(
          'concepto_aporte_adicional'
        )?.value,
        condicion_aporte_adic_dec: this.formFinal.get(
          'condicion_aporte_adic_dec'
        )?.value,

        // * datos para el back end
        nro_solicitud: this.formFinal.get('nro_solicitud')?.value,
        fecha_ultima_liquidacion: this.formFinal.get('fecha_ultima_liquidacion')
          ?.value,
        sub_prog_calc: this.formFinal.get('sub_prog_calc')?.value,
        grupo_familiar_imprimir: this.formFinal.get('grupo_familiar_imprimir')
          ?.value,
        numeracion_auto: this.formFinal.get('numeracion_auto')?.value,
        selecciona_productos_liq: this.formFinal.get('selecciona_productos_liq')
          ?.value,
        agrupador_capita: this.formFinal.get('agrupador_capita')?.value,
        liquidacion_mensual: this.formFinal.get('liquidacion_mensual')?.value,
      });
    }
  }
}

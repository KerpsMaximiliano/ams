import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { AtributosRelacionCapitaPlanService } from 'src/app/core/services/atributos-relacion-capita-plan.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { IAtributosRelacionCapitaPlan } from 'src/app/core/models/atributos-relacion-capita-plan.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditAtributosRelacionCapitaPlanDialogComponent } from './components/add-edit-atributos-relacion-capita-plan-dialog/add-edit-atributos-relacion-capita-plan-dialog.component';

@Component({
  selector: 'app-atributos-relacion-capita-plan',
  templateUrl: './atributos-relacion-capita-plan.component.html',
  styleUrls: ['./atributos-relacion-capita-plan.component.scss'],
})
export class AtributosRelacionCapitaPlanComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public dataSent: IAtributosRelacionCapitaPlan[];
  public fuenteIngreso: IFuenteIngreso;

  constructor(
    private dataSharingService: DataSharingService,
    private fuenteIngresoService: FuenteIngresoService,
    private atributosRelacionCapitaPlanService: AtributosRelacionCapitaPlanService,
    private utilService: UtilService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // this.fuenteIngreso = this.fuenteIngresoService.get();
    this.fuenteIngreso = {
      par_modo: '',
      codigo_fuente_ingreso: 49,
      tipo_fuente: 'S',
      codigo_fuente_admin: 1,
      descripcion: 'prueba              ',
      descripcion_reducida: 'pru  ',
      solicita_ref: 'S',
      dia_corte: 25,
      empresa_asociada: 2,
      nro_solicitud: 0,
      fecha_ultima_liquidacion: 20230508,
      aporte_adicional: 'S',
      fuente_aporte_adicional: 4,
      concepto_aporte_adicional: 79,
      controla_dec_jur: 'N',
      comprobante_general: 'AJTT',
      condicion_venta: 172,
      sub_prog_calc: '          ',
      ref_contable_asociada: '132105     ',
      concepto_aporte: 51001,
      concepto_arancel: 51001,
      agrupa_entidades: 'N',
      grupo_familiar_imprimir: '  ',
      numeracion_auto: 'S',
      talonario: 1,
      liquida_punitorio: 'N',
      liquida_reintegro: 'N',
      liquida_planes_mix: 'N',
      liquida_planes_monotributo: 'N',
      selecciona_productos_liq: 'N',
      condicion_aporte_adic_dec: 51001,
      agrupador_capita: 0,
      liquidacion_mensual: 'N',
      condicion_venta_venc: 1,
      condicion_venta_dos_venc: 2,
      desc_empresa: null,
      es_admin: null,
      es_subord: null,
      es_mixta: null,
      id_excluido: null,
      descripcion_fuente_adm_mixta: 'qweqew',
    };
  }

  ngOnInit(): void {
    if (!this.fuenteIngreso) {
      this.router.navigate(['parametros/fuentes-ingreso']);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public back(): void {
    this.utilService.openLoading();
    this.fuenteIngresoService.setBack(true);
    this.router.navigate(['parametros/fuente-ingreso']);
    return;
  }

  public new(): void {
    const dialogRef = this.openDialog(
      'CREAR ATRIBUTOS SEGÚN RELACIÓN PLAN/CÁPITA',
      'C',
      true
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'Los atributos según relación plan/cápita se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IAtributosRelacionCapitaPlan): void {
    const dialogRef = this.openDialog(
      'EDITAR ATRIBUTOS SEGÚN RELACIÓN PLAN/CÁPITA',
      'U',
      true,
      data
    );
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'Los atributos según relación plan/cápita se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IAtributosRelacionCapitaPlan): void {
    this.openDialog(
      'VER ATRIBUTOS SEGÚN RELACIÓN PLAN/CÁPITA',
      'R',
      false,
      data
    );
  }

  public getData(value: string): void {
    this.utilService.openLoading();
    this.atributosRelacionCapitaPlanService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IAtributosRelacionCapitaPlan[])
          : [res.dataset as IAtributosRelacionCapitaPlan];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión.', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
        if (err.status == 404) this.dataSent = [];
      },
      complete: () => {
        this.utilService.closeLoading();
      },
    });
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    data?: IAtributosRelacionCapitaPlan
  ): MatDialogRef<AddEditAtributosRelacionCapitaPlanDialogComponent, any> {
    return this.dialog.open(AddEditAtributosRelacionCapitaPlanDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        fuenteIngreso: this.fuenteIngreso,
        codigo_fuente_adm_mixta:
          this.fuenteIngreso.codigo_fuente_admin ||
          this.fuenteIngreso.codigo_fuente_ingreso,
        cod_fuente_subordinada: this.fuenteIngreso.codigo_fuente_admin
          ? this.fuenteIngreso.codigo_fuente_ingreso
          : 0,
        producto_cap_adm: data?.producto_cap_adm,
        plan_producto_cap_adm: data?.plan_producto_cap_adm,
        producto_cap_sub: data?.producto_cap_sub,
        genera_liquidacion: data?.genera_liquidacion,
        mod_carga_afiliacion: data?.mod_carga_afiliacion,
        solicita_ddjj: data?.solicita_ddjj,
        liquida_mensualmente: data?.liquida_mensualmente,
        calcula_comision_SN: data?.calcula_comision_SN,
        recupera_Ob_Soc: data?.recupera_Ob_Soc,
        reaseguro_SN: data?.reaseguro_SN,
        legajo: data?.legajo,
        zona: data?.zona,
        division: data?.division,
        seccion: data?.seccion,
        subseccion: data?.subseccion,
        val_cod_empresa: data?.val_cod_empresa,
        controla_dec_juradas: data?.controla_dec_juradas,
        modelo_dec_jurada_vig: data?.modelo_dec_jurada_vig,
        modelo_cuest_baja_vig: data?.modelo_cuest_baja_vig,
        descripcion_plan: data?.descripcion_plan,
        descripcion_producto: data?.descripcion_producto,
        descripcion_subproducto: data?.descripcion_subproducto,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.atributosRelacionCapitaPlanService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getData(
          JSON.stringify({
            par_modo: 'R',
            codigo_fuente_adm_mixta: data.codigo_fuente_adm_mixta,
            cod_fuente_subordinada: data.cod_fuente_subordinada,
            producto_cap_adm: data.producto_cap_adm,
            producto_cap_sub: data.producto_cap_sub,
            plan_producto_cap_adm: data.plan_producto_cap_adm,
          })
        );
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión. ', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
  }
}

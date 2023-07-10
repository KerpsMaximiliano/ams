import { Component, Inject, OnInit } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Forms
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

// * Validators
import { getErrorMessage, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { SetProdSubDialogComponent } from '../set-producto-dialog/set-producto-dialog.component';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { SetMotivMovimientoDialogComponent } from './set-motivo-movimiento-dialog/set-motivo-movimiento-dialog.component';
import { SetPlanDialogComponent } from './set-plan-dialog/set-plan-dialog.component';
import { FuenteIngresoSetDialogComponent } from '../set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';

@Component({
  selector: 'app-add-edit-mvmts-novedades-auto-dialog',
  templateUrl: './add-edit-mvmts-novedades-auto-dialog.component.html',
  styleUrls: ['./add-edit-mvmts-novedades-auto-dialog.component.scss']
})

export class AddEditMvmtsNovedadesAutoDialogComponent implements OnInit {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public activeTabIndex = 0;
  public icon: string;
  public visibilidad: boolean = false;
  movimientos= [
    'ALTA',
    'BAJA',
    'MODIFICACIÓN',
    'REHABILITACIÓN',
    'SUSPENSIÓN'
  ]

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dataSharingService: DataSharingService,
              private dialog: MatDialog) 
              { 
                this.setIcon();
              }

  ngOnInit(): void {
    this.setUpForm();
  }

  public nextStep(): void {
    if (this.activeTabIndex === 0) {
      this.activeTabIndex = 1;
    }
  }

  public prevStep(): void {
    if (this.activeTabIndex === 1) {
      this.activeTabIndex = 0;
    }
  }

  public tabChanged(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }

  public clearInput(input: string){
    switch(input){
      case 'producto_origen':
        this.formGroup.get(input)?.setValue(undefined);
        this.formGroup.get('sub_producto_origen')?.setValue(undefined);
        break;
      case 'producto_relacionado':
        this.formGroup.get(input)?.setValue(undefined);
        this.formGroup.get('sub_prod_rel')?.setValue(undefined);
        break;
      default:
        this.formGroup.get(input)?.setValue(undefined);
        break;
    }
    return 
  }

  public searchDialog(value: string){
    switch(value){
      case 'capita_origen':
        const modalCapita = this.dialog.open(FuenteIngresoSetDialogComponent, {
          data: {
            title: 'SELECCIONE UNA FUENTE DE INGRESO',
            edit: true,
          },
        });
        modalCapita.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.capita_origen = res.codigo_fuente_ingreso;
              this.formGroup
                .get('capita_origen')
                ?.setValue(res.descripcion ? res.descripcion.trim() : 'S/N');
            }
          },
        });
        break;
      case 'producto_origen':
        const modalSetProd = this.dialog.open(SetProdSubDialogComponent, {
          data: {
            title: 'SELECCIONE PRODUCTO',
            edit: true,
            codigo_fuente_ingreso: this.data.capita_origen
          },
        });
        modalSetProd.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.sub_producto_origen = res.codigo_producto;
              this.data.producto_origen = res.producto_administrador;
              this.formGroup
                .get('producto_origen')
                ?.setValue(res.descripcion_producto ? res.descripcion_producto.trim() : 'S/N');
              this.formGroup
                .get('sub_producto_origen')
                ?.setValue(res.descripcion_producto_administrador ? res.res.descripcion_producto_administrador.trim() : 'S/N');
            }
          },
        });
        break;
      case 'plan_origen':
        const modalPlan = this.dialog.open(SetPlanDialogComponent, {
          data: {
            title: 'SELECCIONE UN PLAN',
            edit: true,
            codigo_producto: this.data.producto_origen
          },
        });
        modalPlan.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.plan_origen = res.plan ? res.plan.trim() : res.plan;
              this.formGroup
                .get('plan_origen')
                ?.setValue(res.plan ? res.plan.trim() : res.plan);
            }
          },
        });
        break;
        case 'capita_rel':
        const modalCapita2 = this.dialog.open(FuenteIngresoSetDialogComponent, {
          data: {
            title: 'SELECCIONE UNA FUENTE DE INGRESO',
            edit: true,
          },
        });
        modalCapita2.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.capita_rel = res.codigo_fuente_ingreso;
              this.formGroup
                .get('capita_rel')
                ?.setValue(res.descripcion);
            }
          },
        });
        break;
        case 'producto_relacionado':
        const modalSetProd2 = this.dialog.open(SetProdSubDialogComponent, {
          data: {
            title: 'SELECCIONE PRODUCTO',
            edit: true,
            codigo_fuente_ingreso: this.data.capita_rel
          },
        });
        modalSetProd2.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.sub_prod_rel = res.producto_administrador;
              this.data.producto_relacionado = res.codigo_producto;
              this.formGroup
                .get('producto_relacionado')
                ?.setValue(res.descripcion_producto? res.descripcion_producto.trim() : 'S/N');
              this.formGroup
                .get('sub_prod_rel')
                ?.setValue(res.descripcion_producto_administrador? res.descripcion_producto_administrador.trim() : 'S/N');
            }
          },
        });
        break;
        case 'plan_cambio':
        const modalPlan2 = this.dialog.open(SetPlanDialogComponent, {
          data: {
            title: 'SELECCIONE UN PLAN',
            edit: true,
            codigo_producto: this.data.producto_origen
          },
        });
        modalPlan2.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.plan_cambio = res.plan ? res.plan.trim() : res.plan;
              this.formGroup
                .get('plan_cambio')
                ?.setValue(res.plan);
            }
          },
        });
        break;
        case 'motivo_movimiento':
        const motivoMovimiento = this.dialog.open(SetMotivMovimientoDialogComponent, {
          data: {
            title: 'SELECCIONE UN MOTIVO DE MOVIMIENTO',
            edit: true,
          },
        });
        motivoMovimiento.afterClosed().subscribe({
          next: (res) => {
            if (res) {
              this.data.codigo_motivo = res.id_motivo;
              this.formGroup
                .get('codigo_motivo')
                ?.setValue(res.descripcion ? res.descripcion.trim() : 'S/N');
            }
          },
        });
        break;
    }
  }

  public confirm(): void {
    if(this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        capita_origen: this.data.capita_origen,
        producto_origen: this.data.producto_origen,
        sub_producto_origen: this.data.sub_producto_origen,
        plan_origen: this.data.plan_origen,
        mov_origen: this.formGroup.get('mov_origen')?.value,
        monotributo: this.formGroup.get('monotributo')?.value,
        capita_rel: this.data.capita_rel,
        producto_relacionado: this.data.producto_relacionado,
        sub_prod_rel: this.data.sub_prod_rel,
        sec_prod_rel: this.formGroup.get('sec_prod_rel')?.value,
        movimiento_rel: this.formGroup.get('movimiento_rel')?.value,
        novedad_vinculo: this.formGroup.get('novedad_vinculo')?.value,
        clase_prod: this.formGroup.get('clase_prod')?.value,
        plan_cambio: this.data.plan_cambio,
        opcion_monotributo: this.formGroup.get('opcion_monotributo')?.value,
        codigo_motivo: this.formGroup.get('codigo_motivo')?.value,
      })
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public limpiar(number: number){
    switch(number){
      case 1:
        this.formGroup.get('producto_origen')?.setValue(null);
        this.data.producto_origen = null;
        this.formGroup.get('sub_producto_origen')?.setValue(null);
        this.data.sub_producto_origen = null;
        break;
      case 2:
        this.formGroup.get('producto_relacionado')?.setValue(null);
        this.data.producto_relacionado = null;
        this.formGroup.get('sub_prod_rel')?.setValue(null);
        this.data.sub_prod_rel = null;
        break;
      case 3:
        this.formGroup.get('plan_origen')?.setValue(null);
        this.data.plan_origen = null;
        break;
      case 4:
        this.formGroup.get('plan_cambio')?.setValue(null);
        this.data.plan_cambio = null;
        break;
    }

  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      capita_origen: new UntypedFormControl({value: this.data.capita_origen,
      disabled: this.data.par_modo !== 'C'},
        Validators.compose([
        Validators.required
      ])),
      // Producto
      producto_origen: new UntypedFormControl({value: this.data.producto_origen,
      disabled: this.data.par_modo !== 'C'},
        Validators.compose([
        Validators.required
      ])),
      // Subproducto
      sub_producto_origen: new UntypedFormControl({value: this.data.sub_producto_origen,
      disabled: this.data.par_modo !== 'C'},Validators.compose([
        Validators.required
      ])),
      // Plan
      plan_origen: new UntypedFormControl({value: this.data.plan_origen? this.data.plan_origen.trim() : '',
      disabled: this.data.par_modo !== 'C'},
      Validators.compose([
        Validators.required
      ])),
      // Tipo de Movimiento
      mov_origen: new UntypedFormControl({value: this.data.mov_origen ? this.data.mov_origen.trim() : '',
      disabled: this.data.par_modo !== 'C'},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ])),
       // Monotributo
       monotributo: new UntypedFormControl({value: this.data.monotributo ? this.data.monotributo.trim() : '',
       disabled: this.data.par_modo !== 'C'},
       Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1)
      ])),
      // Fuente de Ingreso 2
      capita_rel: new UntypedFormControl({value: this.data.capita_rel,
      disabled: this.data.par_modo !== 'C'},
      Validators.compose([
        Validators.required
      ])),
      // Secuencia
      sec_prod_rel: new UntypedFormControl({value: this.data.sec_prod_rel,
      disabled: this.data.par_modo !== 'C'},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        isNumeric()
      ])),
      // Producto 2
      producto_relacionado: new UntypedFormControl({value: this.data.producto_relacionado,
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required
      ])),
      // Subproducto 2
      sub_prod_rel: new UntypedFormControl({value: this.data.sub_prod_rel,
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required
      ])),
      // Movimiento
      movimiento_rel: new UntypedFormControl({value: this.data.movimiento_rel ? this.data.movimiento_rel.trim() : '',
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ])),
      // Novedad de Vinculo
      novedad_vinculo: new UntypedFormControl({value: this.data.novedad_vinculo ? this.data.novedad_vinculo.trim() : '',
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1),
        isAlphanumericWithSpaces()
      ])),
      // Clase de producto
      clase_prod: new UntypedFormControl({value: this.data.clase_prod ? this.data.clase_prod.trim() : '',
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)
      ])),
      // Plan
      plan_cambio: new UntypedFormControl({value: this.data.plan_cambio ? this.data.plan_cambio.trim() : '',
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required
      ])),
      // Opcion monotributo
      opcion_monotributo: new UntypedFormControl({value: this.data.opcion_monotributo,
      disabled: !this.data.edit},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        isNumeric()
      ])),
      // Motivo
      codigo_motivo: new UntypedFormControl({value: this.data.codigo_motivo,
      disabled: !this.data.edit},Validators.compose([
        Validators.required
      ])),
    })
  }

  private setIcon(): void {
    switch (this.data.par_modo) {
      case 'C':
        this.icon = 'add_box';
        break;
      case 'U':
        this.icon = 'edit';
        break;
      case 'R':
        this.icon = 'visibility';
        break;
      default:
        this.icon = '';
        break;
    }
  }
}

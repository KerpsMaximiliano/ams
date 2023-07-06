import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { MvmtsNovedadesAutoService } from 'src/app/core/services/mvmts-novedades-auto.service';

// * Interfaces
import { IMvmtsNovedadesAuto } from 'src/app/core/models/mvmts-novedades-auto.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditMvmtsNovedadesAutoDialogComponent } from './add-edit-mvmts-novedades-auto-dialog/add-edit-mvmts-novedades-auto-dialog.component';
import { MvmtsNovedadesAutoDashboardComponent } from './mvmts-novedades-auto-dashboard/mvmts-novedades-auto-dashboard.component';

@Component({
  selector: 'app-mvmts-novedades-auto-automaticas',
  templateUrl: './mvmts-novedades-auto.component.html',
  styleUrls: ['./mvmts-novedades-auto.component.scss'],
})
export class MvmtsNovedadesAutoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  @ViewChild(MvmtsNovedadesAutoDashboardComponent)
  dashboard: MvmtsNovedadesAutoDashboardComponent;
  
  dataSent: IMvmtsNovedadesAuto[];
  request: boolean = false;

  constructor(
    private dataSharingService: DataSharingService,
    private mvmtsAutoService: MvmtsNovedadesAutoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMÁTICAS', 'C', true);
    this.dataSubscription = this.dataSharingService
    .getData()
    .subscribe((res) => {
      this.performCRUD(
          res,
          'El movimiento para novedades automáticas se ha creado exitosamente. ',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IMvmtsNovedadesAuto): void {
    const dialogRef = this.openDialog('EDITAR REGLAS PARA MOVIMIENTOS PARA NOVEDADES AUTOMÁTICAS', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La regla para movimiento de novedades automáticas se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IMvmtsNovedadesAuto): void {
    this.openDialog('VER REGLA PARA MOVIMIENTOS PARA NOVEDADES AUTOMÁTICAS', 'R', false, data);
  }

  public getMvmts(value: string): void {
    this.utilService.openLoading();
    this.mvmtsAutoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IMvmtsNovedadesAuto[])
          : [res.dataset as IMvmtsNovedadesAuto];
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        if (err.status == 0) {
          this.utilService.notification('Error de conexión.', 'error');
        } else {
          this.utilService.notification(
            `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
            'error'
          );
        }
        if (err.status == 404) {
          this.dataSent = [];
        }
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
    data?: IMvmtsNovedadesAuto
  ) {
    return this.dialog.open(AddEditMvmtsNovedadesAutoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        capita_origen: data?.capita_origen,
        producto_origen: data?.producto_origen,
        sub_producto_origen: data?.sub_producto_origen,
        plan_origen: data?.plan_origen,
        mov_origen: data?.mov_origen,
        monotributo: data?.monotributo,
        capita_rel: data?.capita_rel,
        sec_prod_rel: data?.sec_prod_rel,
        producto_relacionado: data?.producto_relacionado,
        sub_prod_rel: data?.sub_prod_rel,
        movimiento_rel: data?.movimiento_rel,
        novedad_vinculo: data?.novedad_vinculo,
        clase_prod: data?.clase_prod,
        plan_cambio: data?.plan_cambio,
        opcion_monotributo: data?.opcion_monotributo,
        codigo_motivo: data?.codigo_motivo,  
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.mvmtsAutoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getMvmts(
          JSON.stringify({
            par_modo: 'R',
            capita_origen: data.capita_origen,
            producto_origen: data.producto_origen,
            sub_producto_origen: data.sub_producto_origen,
            plan_origen: data.plan_origen,
            mov_origen: data.mov_origen,
            monotributo: data.monotributo,
            capita_rel: data.capita_rel,
            sec_prod_rel: data.sec_prod_rel ? data.sec_prod_rel : 0
          })
        );
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        if (err.status === 0) {
          this.utilService.notification('Error de conexión.', 'error');
        } else {
          this.utilService.notification(
            `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
            'error'
          );
        }
      },
    });
  }
}

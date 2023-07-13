import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { LocalidadService } from 'src/app/core/services/localidad.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IDepartamento } from 'src/app/core/models/departamento.interface';
import {
  IEnvio,
  ILocalidad,
  IPromocion,
} from 'src/app/core/models/localidad.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditLocalidadDialogComponent } from './components/add-edit-localidad-dialog/add-edit-localidad-dialog.component';

@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.scss'],
})
export class LocalidadComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;

  public promociones: IPromocion[];
  public envios: IEnvio[];
  public provincias: IProvincia[];
  public departamentos: IDepartamento[];
  public dataSent: ILocalidad[] = [];
  public placeholder: string = 'Seleccione una provincia. ';

  constructor(
    private dataSharingService: DataSharingService,
    private provinciaService: ProvinciaService,
    private localidadService: LocalidadService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.provinciaService.getProvincias() === undefined) {
      this.getProvincias();
    } else {
      this.provincias = this.provinciaService.getProvincias();
    }
    if (this.provinciaService.getEnvios() === undefined) {
      this.getEnvios();
    } else {
      this.envios = this.provinciaService.getEnvios();
    }
    if (this.provinciaService.getPromociones() === undefined) {
      this.getPromociones();
    } else {
      this.promociones = this.provinciaService.getPromociones();
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR LOCALIDAD', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La localidad se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: ILocalidad): void {
    const dialogRef = this.openDialog('EDITAR LOCALIDAD', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'La localidad se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: ILocalidad): void {
    this.openDialog('VER LOCALIDAD', 'R', false, data);
  }

  public getLocalidad(value: string): void {
    this.utilService.openLoading();
    this.localidadService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as ILocalidad[])
          : [res.dataset as ILocalidad];
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

  public onDepartamentosLoaded(departamentos: IDepartamento[]): void {
    this.departamentos = departamentos;
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    data?: ILocalidad
  ): MatDialogRef<AddEditLocalidadDialogComponent, any> {
    return this.dialog.open(AddEditLocalidadDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        provincias: this.provincias,
        departamentos: this.departamentos,
        promociones: this.promociones,
        envios: this.envios,
        codigo_postal: data?.codigo_postal,
        sub_codigo_postal: data?.sub_codigo_postal,
        descripcion: data?.descripcion,
        desc_prov: data?.desc_prov,
        letra_provincia: data?.letra_provincia,
        posicion_referente: data?.posicion_referente,
        visitado_auditor: data?.visitado_auditor,
        zona_promocion: data?.zona_promocion,
        desc_depto: data?.desc_depto,
        codigo_departamento: data?.codigo_departamento,
        zona_envio: data?.zona_envio,
        ingreso_ticket: data?.ingreso_ticket,
        zona_atencion: data?.zona_atencion,
        cant_habitantes: data?.cant_habitantes,
        desc_position: data?.desc_position,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.localidadService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getLocalidad(
          JSON.stringify({
            par_modo: 'R',
            codigo_postal: data.codigo_postal,
            letra_provincia: data.letra_provincia,
          })
        );
      },
      error: (err: any) => {
        this.utilService.closeLoading();
        err.status === 0
          ? this.utilService.notification('Error de conexión.', 'error')
          : this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
  }

  private getProvincias(): void {
    this.utilService.openLoading();
    this.provinciaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          nombre_provincia: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.provincias = Array.isArray(res.dataset)
            ? (res.dataset as IProvincia[])
            : [res.dataset as IProvincia];
        },
        error: (err: any) => {
          this.placeholder = 'No se han podido cargar las provincias.';
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: No se han podido cargar las provincias.`,
              'error'
            );
          }
        },
        complete: () => {
          this.provinciaService.setProvincias(this.provincias);
          this.utilService.closeLoading();
        },
      });
  }

  private getPromociones(): void {
    this.localidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.provinciaService.setPromociones(
            Array.isArray(res.dataset)
              ? (res.dataset as IPromocion[])
              : [res.dataset as IPromocion]
          );
          this.promociones = this.provinciaService.getPromociones();
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
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private getEnvios(): void {
    this.localidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'E',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.provinciaService.setEnvios(
            Array.isArray(res.dataset)
              ? (res.dataset as IEnvio[])
              : [res.dataset as IEnvio]
          );
          this.envios = this.provinciaService.getEnvios();
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: No se han podido cargar los envios.`,
              'error'
            );
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}

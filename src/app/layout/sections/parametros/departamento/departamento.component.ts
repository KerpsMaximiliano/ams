import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IDepartamento } from 'src/app/core/models/departamento.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditDepartamentoDialogComponent } from './components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss'],
})
export class DepartamentoComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | undefined;
  public provincias: IProvincia[];
  public dataSent: IDepartamento[];
  public request: boolean = false;

  constructor(
    private dataSharingService: DataSharingService,
    private provinciaService: ProvinciaService,
    private departamentoService: DepartamentoService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProvincias();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR DEPARTAMENTO', 'C', true);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El departamento se ha creado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public edit(data: IDepartamento): void {
    const dialogRef = this.openDialog('EDITAR DEPARTAMENTO', 'U', true, data);
    this.dataSubscription = this.dataSharingService
      .getData()
      .subscribe((res) => {
        this.performCRUD(
          res,
          'El departamento se ha editado exitosamente.',
          dialogRef
        );
      });
    dialogRef.afterClosed().subscribe(() => {
      this.dataSharingService.unsubscribeData(this.dataSubscription!);
      this.dataSubscription = undefined;
    });
  }

  public view(data: IDepartamento): void {
    this.openDialog('VER DEPARTAMENTO', 'R', false, data);
  }

  public getDepartamento(value: string): void {
    this.utilService.openLoading();
    this.departamentoService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IDepartamento[])
          : [res.dataset as IDepartamento];
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
    data?: IDepartamento
  ): MatDialogRef<AddEditDepartamentoDialogComponent, any> {
    return this.dialog.open(AddEditDepartamentoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        provincias: this.provincias,
        letra_provincia: data?.letra_provincia,
        codigo_departamento: data?.codigo_departamento,
        descripcion: data?.descripcion,
        descripcion_reducida: data?.descripcion_reducida,
      },
    });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    this.utilService.openLoading();
    this.departamentoService.CRUD(data).subscribe({
      next: () => {
        this.utilService.notification(successMessage, 'success');
        dialogRef.close();
        this.getDepartamento(
          JSON.stringify({
            par_modo: 'R',
            tipo_de_documento: data.tipo_de_documento,
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
          this.request = true;
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
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}

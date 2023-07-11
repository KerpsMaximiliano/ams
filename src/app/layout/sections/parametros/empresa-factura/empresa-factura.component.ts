import { Component, OnInit } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

// * Interfaces
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditEmpresaFacturaComponent } from './components/add-edit-empresa-factura/add-edit-empresa-factura.component';

@Component({
  selector: 'app-empresa-factura',
  templateUrl: './empresa-factura.component.html',
  styleUrls: ['./empresa-factura.component.scss'],
})
export class EmpresaFacturaComponent implements OnInit {
  public descripcion: string;
  public dataSent: IEmpresaFactura[] = [];

  constructor(
    private empresaFacturaService: EmpresaFacturaService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public new(): void {
    const dialogRef = this.openDialog('CREAR EMPRESA QUE FACTURA', 'C', true);
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(res, 'La Empresa se ha creado exitosamente.', dialogRef);
    });
  }

  public edit(data: IEmpresaFactura): void {
    const dialogRef = this.openDialog(
      'EDITAR EMPRESA QUE FACTURA',
      'U',
      true,
      data
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(
        res,
        'La Empresa se ha editado exitosamente.',
        dialogRef
      );
    });
  }

  public view(data: IEmpresaFactura): void {
    this.openDialog('VER EMPRESA QUE FACTURA', 'R', false, data);
  }

  public getEmpresaFactura(value: string): void {
    this.utilService.openLoading();
    this.empresaFacturaService.CRUD(value).subscribe({
      next: (res: any) => {
        this.dataSent = Array.isArray(res.dataset)
          ? (res.dataset as IEmpresaFactura[])
          : [res.dataset as IEmpresaFactura];
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
    empresaFactura?: IEmpresaFactura
  ): MatDialogRef<AddEditEmpresaFacturaComponent, any> {
    return this.dialog.open(AddEditEmpresaFacturaComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        id_empresa: empresaFactura?.id_empresa,
        descripcion: empresaFactura?.descripcion,
        calle: empresaFactura?.calle,
        nro_puerta: empresaFactura?.nro_puerta,
        piso: empresaFactura?.piso,
        departamento: empresaFactura?.departamento,
        codigo_postal: empresaFactura?.codigo_postal,
        sub_codigo_postal: empresaFactura?.sub_codigo_postal,
        nro_tel: empresaFactura?.nro_tel,
        nro_fax: empresaFactura?.nro_fax,
        email: empresaFactura?.email,
        codigo_iva: empresaFactura?.codigo_iva,
        cuit: empresaFactura?.cuit,
        fecha_vto_cuit: empresaFactura?.fecha_vto_cuit,
        moneda1: empresaFactura?.moneda1,
        ref_contable_acreedora1: empresaFactura?.ref_contable_acreedora1,
        moneda2: empresaFactura?.moneda2,
        ref_contable_acreedora2: empresaFactura?.ref_contable_acreedora2,
        cta_banco_ams: empresaFactura?.cta_banco_ams,
        campo_desc1: empresaFactura?.campo_desc1,
        campo_desc2: empresaFactura?.campo_desc2,
        comprobante_generar: empresaFactura?.comprobante_generar,
        codigo_sicone: empresaFactura?.codigo_sicone,
        gen_min_como_empr: empresaFactura?.gen_min_como_empr,
        codigo_postal_arg: empresaFactura?.codigo_postal_arg,
        nro_inscripcion_igb: empresaFactura?.nro_inscripcion_igb,
        fecha_inicio_act: empresaFactura?.fecha_inicio_act,
        trabaja_ref_cont: empresaFactura?.trabaja_ref_cont,
        fact_cr_elec: empresaFactura?.fact_cr_elec,
        cbu_nro: empresaFactura?.cbu_nro,
      },
    });
  }

  validarModo(modo: any, res: any) {
    this.empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'M',
          id_empresa: res.dataset.id_empresa,
          modo: modo,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.utilService.notification(res.estado.Mensaje);
        },
        error: (err: any) => {
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                'error'
              );
        },
      });
  }

  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    if (data) {
      this.utilService.openLoading();
      this.empresaFacturaService.CRUD(data.empresa).subscribe({
        next: (res) => {
          this.utilService.notification(successMessage, 'success');
          this.validarModo(data.modo.modo, res);
          dialogRef.close();
          this.getEmpresaFactura(
            JSON.stringify({
              par_modo: 'O',
              descripcion: data.empresa.descripcion,
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
        complete: () => {
          this.utilService.closeLoading();
        },
      });
    }
  }

  public filter(data: string): void {
    this.getEmpresaFactura(data);
  }
}

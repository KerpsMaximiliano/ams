import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PosicionesService } from 'src/app/core/services/abm-posiciones.service';
import { UtilService } from 'src/app/core/services/util.service';
import { isNumeric } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-modal-localidad',
  templateUrl: './modal-localidad.component.html',
  styleUrls: ['./modal-localidad.component.scss']
})
export class ModalLocalidadComponent {
  formGroup: any;
  paramProv: any;
  selection = [];
  // block = new SelectionModel(false, []);
  public localidad: any;
  public dataSource: any;

  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    'letra_provincia',
    'actions'
  ];
  aux: any;
  block: boolean = false;

  constructor(
    private utils: UtilService,
    private dialogRefLocal: MatDialogRef<ConfirmDialogComponent>,
    private posicionesService: PosicionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
    this.setUpForm()
  }

  ngOnInit (){
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.posicionesService.getProv(bodyprov).subscribe({
      next:(res) => {
        this.paramProv = res.dataset
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
          console.log(err.error.returnset.Mensaje);
        }
    })
  }

  // limpiarLocal() {
  //   this.block = false;
  // }

  onCheckboxChange(row: any) {
    if (this.selection.length < 1){
      if (row) {
        console.log(`Se ha marcado la casilla de la fila ${row.codigo_departamento}`);
        this.selection = row;
        this.block = true;
      } else{
        console.log(`Se ha desmarcado la casilla de la fila ${row.codigo_departamento}`);
      }
    } else {
      this.selection=[];
      this.block = false;
      console.log(`Casilla de la fila ${row.codigo_departamento}`);
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_postal: new UntypedFormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(7),
        isNumeric
      ])),
      descripcion: new UntypedFormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(30),
      ])),
      letra_provincia: new UntypedFormControl('', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
    })
  }

  closeDialog() {
    this.dialogRefLocal.close(false);
  }

  search(){
    this.utils.openLoading();
    this.aux = {
      letra_provincia: this.formGroup.get('letra_provincia')?.value,
      codigo_postal: this.formGroup.get('codigo_postal')?.value ? this.formGroup.get('codigo_postal')?.value : '0',
      descripcion: this.formGroup.get('descripcion')?.value
    }
    if (this.aux.codigo_postal != ''){
      this.aux.par_modo =  'M';
      this.posicionesService.getLocal(this.aux).subscribe({
        next:(res:any) => {
          console.log(res);
          (res.dataset.length)
          ? this.localidad = res.dataset as any[]
          : this.localidad = [res.dataset];
          this.dataSource = new MatTableDataSource<any>(this.localidad);
        },
        error:(err: any) => {
          this.utils.closeLoading();
          (err.status == 0)
            ? this.utils.notification('Error de conexion', 'error') 
            : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
        },
        complete: () => {
          this.utils.closeLoading();
        }
      });
    }
    else {
      this.aux.par_modo = 'M';
      this.posicionesService.getLocal(this.aux).subscribe({
        next:(res:any) => {
          console.log(res);
          this.localidad = res.dataset as any[];
          this.dataSource = new MatTableDataSource<any>(this.localidad);
        },
        error:(err: any) => {
          this.utils.closeLoading();
          (err.status == 0)
            ? this.utils.notification('Error de conexion', 'error') 
            : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
        },
        complete: () => {
          this.utils.closeLoading();
        }
      });
    }
  }

  public clearInputs(){
    this.formGroup.get('descripcion').setValue('');
    this.formGroup.get('letra_provincia').setValue('');
    this.formGroup.get('codigo_postal').setValue('');
  }

  confirm(): void {
    this.dialogRefLocal.close({
      datos: this.selection
    })
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`
      }
      if ((control.errors?.['notAlphanumeric'] || control.errors?.['notAlphanumericWithSpaces']) && control.value != '' && control.value != null) {
        return `No puede contener caracteres especiales`
      }
    }
    return '';
  }
}

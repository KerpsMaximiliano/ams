import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { PosicionesService } from 'src/app/core/services/abm-posiciones.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-modal-localidad',
  templateUrl: './modal-localidad.component.html',
  styleUrls: ['./modal-localidad.component.scss']
})
export class ModalLocalidadComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  new MatPaginator(new MatPaginatorIntl(), this.cdr);
  formGroup: any;

  paramDepto:[]| any;
  paramProv:[]| any;
  selection = [];
  myControlProv = new UntypedFormControl('');
  provinciaFiltrados: Observable<any[]>;
  myControldepto = new UntypedFormControl('');
  deptoFiltrados: Observable<any[]>;

  public localidad: any;
  public dataSource: any;
  public displayedColumns: string[] = [
    'codigo_postal',
    'descripcion',
    'actions'
  ];
  aux: any;
  block: boolean = false;

  constructor(
    private utils: UtilService,
    private dialogRefLocal: MatDialogRef<ConfirmDialogComponent>,
    private posicionesService: PosicionesService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
    this.setUpForm()
  }

  ngOnInit (){
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.utils.openLoading();
    this.posicionesService.getProv(bodyprov).subscribe({
      next:(res) => {
        this.paramProv = res.dataset
        this.utils.closeLoading();
      },
      error:(err) => {
        this.utils.closeLoading
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
    this.provinciaFiltrados = this.myControlProv.valueChanges.pipe(
      startWith(''),
      map((valueProv: { nombre_provincia: any; }) => {
        const nameProv = typeof valueProv === 'string' ? valueProv : valueProv?.nombre_provincia;
        return nameProv ? this._filterProv(nameProv as string) : this.paramProv?.nombre_provincia;
      }),
    )
  }

  displayFnProv(prov: any): string {
    return prov && prov.nombre_provincia ? prov.nombre_provincia : '';
  }

  private _filterProv(nameProv: string): any[] {
    const filterValueProv = nameProv.toLowerCase();
    return this.paramProv.filter((prov:any) => prov.nombre_provincia.toLowerCase().includes(filterValueProv));
  }

  buscar(letra_provincia:string){ 
    this.formGroup.get('letra_provincia')?.setValue(letra_provincia),
    console.log(letra_provincia);
    let bodydep = {
      par_modo: 'C',
      descripcion:'',
      letra_provincia:letra_provincia
    }
    this.utils.openLoading();
    this.posicionesService.getDepart(bodydep).subscribe({
      next:(res) => {this.paramDepto = res.dataset
        
      },
      error:(err) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      },
      complete: () => {
        this.utils.closeLoading();
        setTimeout(() => {
        }, 300);
      }
    })
    this.deptoFiltrados = this.myControldepto.valueChanges.pipe(
      startWith(''),
      map(valueDep => {
        const nameDepto = typeof valueDep === 'string' ? valueDep : valueDep?.descripcion;
        return nameDepto ? this._filterDep(nameDepto as string) : this.paramDepto?.descripcion;
      }),
    )
  }

  displayFnDep(depto: any): string {
    return depto && depto.descripcion ? depto.descripcion : '';
  }

  private _filterDep(nameDepto: string): any[] {
    const filterValueDepto = nameDepto.toLowerCase();
    return this.paramDepto.filter((filtroDep:any) => filtroDep.descripcion.toLowerCase().includes(filterValueDepto));
  }

  dato(codigo: string) {
    this.formGroup.get('codigo_departamento')?.setValue(codigo);
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
      "codigo_postal": new FormControl(''),
      "letra_provincia": new FormControl(''),
      "codigo_departamento": new FormControl(''),
      "descripcion": new FormControl('')
    })
  }

  closeDialog() {
    this.dialogRefLocal.close(false);
  }

  search(){
    this.utils.openLoading();
    this.aux = {
      letra_provincia: this.formGroup.get('letra_provincia')?.value,
    }
    if (!(this.formGroup.get('codigo_postal')?.value == null || this.formGroup.get('codigo_postal')?.value == '') ){
      this.aux.codigo_postal = parseInt(this.formGroup.get('codigo_postal')?.value)
      this.aux.par_modo =  'R';
      this.posicionesService.getCRUD(JSON.stringify(this.aux)).subscribe({
        next:(res:any) => {
          console.log(res);
          (res.dataset.length)
          ? this.localidad = res.dataset 
          : this.localidad = [res.dataset];
          this.dataSource = new MatTableDataSource<any>(this.localidad);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.getRangeLabel = (): string => {
              return "Página " +  (this.paginator.pageIndex + 1) + " de " +  this.paginator.length
            }
          }, 100)
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
      this.aux.par_modo = 'C'
      this.aux.codigo_departamento = this.formGroup.get('codigo_departamento')?.value,
      this.aux.descripcion = this.formGroup.get('descripcion')?.value,
      this.posicionesService.getCRUD(JSON.stringify(this.aux)).subscribe({
        next:(res:any) => {
          console.log(res);
          
          this.localidad = res.dataset;
          this.dataSource = new MatTableDataSource<any>(this.localidad);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.getRangeLabel = (): string => {
              return "Página " +  (this.paginator.pageIndex + 1) + " de " +  this.paginator.length
            }
          }, 100)
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
    this.formGroup.get('codigo_departamento').setValue('');
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

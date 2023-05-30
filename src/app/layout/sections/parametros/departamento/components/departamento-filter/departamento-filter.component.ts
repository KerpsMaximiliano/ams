import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Provincia, ProvinciaResponse } from 'src/app/core/models/provincia';
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-departamento-filter',
  templateUrl: './departamento-filter.component.html',
  styleUrls: ['./departamento-filter.component.scss']
})
export class DepartamentoFilterComponent {

  @Input() provincias$: Observable<ProvinciaResponse>;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searchForm = new FormGroup({
    letra_provincia: new FormControl(''),
    descripcion: new FormControl('')
  })
  myControlProv = new UntypedFormControl('');
  provinciaFiltrados: Observable<ProvinciaResponse[]>| any;
  // paramProv: any;

  paramProv: []|any;
  
  constructor(
    private provinciaService: ProvinciaService,
    private utils: UtilService
    ) {
    
  }
  
  ngOnInit(): void {
    this.provinciaService.provinciaList
    .subscribe( {
      next:(res: any) => {this.paramProv = res?.dataset
      },
      error:(err: any) => {
        console.log(err);
        (err.status == 0)
          ? this.utils.notification('Error de conexion', 'error') 
          : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
      }
    })
    console.log(this.paramProv);
    this.provinciaFiltrados = this.myControlProv.valueChanges.pipe(
      startWith(''),
      map(valueProv => {
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

  buscar(codigo: string){
    this.searchForm.get('letra_provincia')?.setValue(codigo);
  }

  public search(){
    this.searchEvent.emit(this.searchForm.value);
  }

  public clearInputs(){
    this.myControlProv.setValue('codigo');
    this.searchForm.get('letra_provincia')?.setValue('');
    this.searchForm.get('descripcion')?.setValue('');
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value)
  }
}
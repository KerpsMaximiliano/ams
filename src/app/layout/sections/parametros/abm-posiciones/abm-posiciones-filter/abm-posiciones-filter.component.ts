import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { PosicionesService } from 'src/app/core/services/abm-posiciones.service';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-posiciones-filter',
  templateUrl: './abm-posiciones-filter.component.html',
  styleUrls: ['./abm-posiciones-filter.component.scss']
})
export class AbmPosicionesFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searching = new FormGroup({
    "letra_provincia": new FormControl(),
    "descripcion": new FormControl('')
  })
  utils: any;
  paramProv: any;
  myControlProv = new UntypedFormControl('');
  provinciaFiltrados: Observable<any[]>;
  constructor(private posicionesService: PosicionesService,) { }
  
  ngOnInit(): void {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia:''
    }
    this.posicionesService.getProv(bodyprov).subscribe({
      next:(res) => {this.paramProv = res.dataset
        console.log(res);
      },
      error:(err) => {
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

  dato(codigo: string) {
    this.searching.value.letra_provincia = codigo;
  }

  public search(): void {
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.letra_provincia = '';
    this.searching.value.descripcion = '';
    this.search();
  }
}
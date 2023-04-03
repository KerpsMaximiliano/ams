import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isAlphanumeric, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-localidades-filter',
  templateUrl: './abm-localidades-filter.component.html',
  styleUrls: ['./abm-localidades-filter.component.scss']
})
export class AbmLocalidadesFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "codigo": new FormControl(''),
    "nombre_provincia": new FormControl(''),
    "nombre_departamento": new FormControl(''),
    "nombre_localidad": new FormControl('')

  })

  constructor() { }

  ngOnInit(): void {
    //  this.setUpForm()
  }

  public search(){
    console.log(this.searching.value);
    this.searchEvent.emit(this.searching.value)
  }

  
  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.codigo = '';
    this.searching.value.nombre_provincia = '';
    this.searching.value.nombre_departamento = '';
    this.searching.value.nombre_localidad = '';
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}

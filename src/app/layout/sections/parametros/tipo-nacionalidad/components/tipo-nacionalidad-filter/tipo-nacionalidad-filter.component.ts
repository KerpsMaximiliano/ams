import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-tipo-nacionalidad-filter',
  templateUrl: './tipo-nacionalidad-filter.component.html',
  styleUrls: ['./tipo-nacionalidad-filter.component.scss']
})
export class TipoNacionalidadFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "id": new FormControl('',isNumeric),
    "descripcion": new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
    //  this.setUpForm()
  }



  public search(){
    this.searchEvent.emit(this.searching.value)
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.id;
    this.searching.value.descripcion = '';
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}

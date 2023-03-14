import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-tipo-documento-filter',
  templateUrl: './tipo-documento-filter.component.html',
  styleUrls: ['./tipo-documento-filter.component.scss']
})
export class TipoDocumentoFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searching = new FormGroup({
    "id": new FormControl('',isNumeric),
    "descripcion": new FormControl('')
  })
  constructor() { }
  
  ngOnInit(): void {
  }

  public search(): void {
    this.searchEvent.emit(this.searching.value)
  }

  public searchid(e: any){
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }

  public clearInputs(){
    this.searching.value.id;
    this.searching.value.descripcion = '';
    this.search();
  }
}
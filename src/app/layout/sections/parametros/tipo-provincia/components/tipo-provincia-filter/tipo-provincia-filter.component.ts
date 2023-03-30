import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isNumeric } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-tipo-provincia-filter',
  templateUrl: './tipo-provincia-filter.component.html',
  styleUrls: ['./tipo-provincia-filter.component.scss']
})
export class TipoProvinciaFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "Cod_provincia": new FormControl(''),
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
    this.searching.value.Cod_provincia;
    this.searching.value.descripcion = '';
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-provincia-filter',
  templateUrl: './provincia-filter.component.html',
  styleUrls: ['./provincia-filter.component.scss']
})
export class ProvinciaFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    "codigo": new FormControl(''),
    "nombre_provincia": new FormControl('')
  })

  constructor() { }

  ngOnInit(): void {
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
    this.search();
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value)
  }
}
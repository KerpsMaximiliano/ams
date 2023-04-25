import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-provincia-filter',
  templateUrl: './provincia-filter.component.html',
  styleUrls: ['./provincia-filter.component.scss']
})
export class ProvinciaFilterComponent {

  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  nombre_provincia = new FormControl('');  

  constructor() { }

  ngOnInit(): void {
  }

  public search(){
    this.searchEvent.emit(this.nombre_provincia.value)
  }

  public clearInputs(){
    this.nombre_provincia.setValue('');
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    this.searchEvent.emit(this.nombre_provincia.value)
  }
}
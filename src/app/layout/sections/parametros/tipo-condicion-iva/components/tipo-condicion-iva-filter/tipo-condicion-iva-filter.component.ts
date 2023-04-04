import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './tipo-condicion-iva-filter.component.html',
  styleUrls: ['./tipo-condicion-iva-filter.component.scss']
})
export class CondicionIvaFilterComponent {

  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  public descripcion = new UntypedFormControl('');
  constructor() { }
  
  ngOnInit(): void {
  }

  public search(): void {
    this.searchEvent.emit(this.descripcion.value)
  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    if(this.descripcion.value.length > 2 ) {
      this.searchEvent.emit(this.descripcion.value)
    }
  }

  public clearInputs(): void {
    this.descripcion.setValue("");
    this.search();
  }
}
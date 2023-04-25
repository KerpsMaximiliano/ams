import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-condicion-iva-filter',
  templateUrl: './condicion-iva-filter.component.html',
  styleUrls: ['./condicion-iva-filter.component.scss']
})
export class CondicionIvaFilterComponent {
  body: string | any;
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  public descripcion = new UntypedFormControl('');
  constructor() { }
  
  ngOnInit(): void {
  }

  public search(): void {
    this.body = {
      par_modo: "G",
      descripcion: this.descripcion.value
    };
    this.searchEvent.emit(this.body)

  }

  public searchKeyUp(e:any): void {
    e.preventDefault();
    if(this.descripcion.value.length > 2 ) {
      this.searchEvent.emit(this.descripcion.value)
    }
  }

  public clearInputs(): void {
    this.descripcion.setValue("");
  }
}
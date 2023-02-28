import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-tipo-documento-filter',
  templateUrl: './tipo-documento-filter.component.html',
  styleUrls: ['./tipo-documento-filter.component.scss']
})
export class TipoDocumentoFilterComponent {

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
    this.searchEvent.emit(this.descripcion.value)
  }

  public clearInputs(): void {
    this.descripcion.setValue("");
    this.search();
  }
}
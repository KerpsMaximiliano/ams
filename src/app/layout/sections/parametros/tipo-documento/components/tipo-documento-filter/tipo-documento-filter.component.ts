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

  public search(){
    this.searchEvent.emit(this.descripcion.value)
  }

  public clearInputs(){
    this.descripcion.setValue("");
    this.search();
  }

}

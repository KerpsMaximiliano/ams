import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-tipo-nacionalidad-filter',
  templateUrl: './tipo-nacionalidad-filter.component.html',
  styleUrls: ['./tipo-nacionalidad-filter.component.scss']
})
export class TipoNacionalidadFilterComponent {

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

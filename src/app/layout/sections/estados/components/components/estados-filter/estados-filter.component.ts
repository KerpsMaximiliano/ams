import { Component, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-estados-filter',
  templateUrl: './estados-filter.component.html',
  styleUrls: ['./estados-filter.component.scss']
})
export class EstadosFilterComponent {

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

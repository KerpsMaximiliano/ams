import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tipo-documento-filter',
  templateUrl: './tipo-documento-filter.component.html',
  styleUrls: ['./tipo-documento-filter.component.scss'],
})
export class TipoDocumentoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}

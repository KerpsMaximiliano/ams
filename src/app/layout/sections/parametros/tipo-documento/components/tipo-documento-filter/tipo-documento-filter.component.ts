import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tipo-documento-filter',
  templateUrl: './tipo-documento-filter.component.html',
  styleUrls: ['./tipo-documento-filter.component.scss'],
})
export class TipoDocumentoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      par_modo: 'O',
      descripcion: value,
    };
    this.searchEvent.emit(JSON.stringify(body));
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}

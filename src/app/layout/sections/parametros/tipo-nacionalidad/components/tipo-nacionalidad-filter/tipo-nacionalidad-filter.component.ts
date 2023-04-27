import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tipo-nacionalidad-filter',
  templateUrl: './tipo-nacionalidad-filter.component.html',
  styleUrls: ['./tipo-nacionalidad-filter.component.scss'],
})
export class TipoNacionalidadFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      id: '',
      descripcion: value,
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}

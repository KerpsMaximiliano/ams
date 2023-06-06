import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nacionalidad-filter',
  templateUrl: './nacionalidad-filter.component.html',
  styleUrls: ['./nacionalidad-filter.component.scss'],
})
export class NacionalidadFilterComponent {
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

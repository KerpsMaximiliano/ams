import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-formas-pago-filter',
  templateUrl: './formas-pago-filter.component.html',
  styleUrls: ['./formas-pago-filter.component.scss'],
})
export class FormasPagoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      // COMPLETAR
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}

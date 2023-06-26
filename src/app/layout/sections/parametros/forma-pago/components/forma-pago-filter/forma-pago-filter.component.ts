import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forma-pago-filter',
  templateUrl: './forma-pago-filter.component.html',
  styleUrls: ['./forma-pago-filter.component.scss'],
})
export class FormaPagoFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        description: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}

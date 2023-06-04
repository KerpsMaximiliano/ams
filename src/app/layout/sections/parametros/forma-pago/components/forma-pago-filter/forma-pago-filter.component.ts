import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forma-pago-filter',
  templateUrl: './forma-pago-filter.component.html',
  styleUrls: ['./forma-pago-filter.component.scss'],
})
export class FormaPagoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      par_modo: 'C',
      description: value,
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-provincia-filter',
  templateUrl: './provincia-filter.component.html',
  styleUrls: ['./provincia-filter.component.scss'],
})
export class ProvinciaFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      par_modo: 'R',
      nombre_provincia: value,
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }
}

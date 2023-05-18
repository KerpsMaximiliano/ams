import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-producto-filter',
  templateUrl: './producto-filter.component.html',
  styleUrls: ['./producto-filter.component.scss'],
})
export class ProductoFilterComponent {
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

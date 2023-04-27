import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-estado-civil-filter',
  templateUrl: './estado-civil-filter.component.html',
  styleUrls: ['./estado-civil-filter.component.scss'],
})
export class EstadoCivilFilterComponent {
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

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pregunta-ddjj-filter',
  templateUrl: './pregunta-ddjj-filter.component.html',
  styleUrls: ['./pregunta-ddjj-filter.component.scss'],
})
export class PreguntaDDJJFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('selectOptions') selectOptions: any;

  isCleanButtonDisabled = true;

  constructor() {}

  ngOnInit(): void {}

  public search(): void {
    let selectedValue = this.selectOptions?.value || '';
    let body = {
      par_modo: 'O',
      modelo_formulario: selectedValue,
    };
    this.searchEvent.emit(JSON.stringify(body));
  }

  public clean(): void {
    this.selectOptions.value = '';
  }
}

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preguntas-ddjj-filter',
  templateUrl: './preguntas-ddjj-filter.component.html',
  styleUrls: ['./preguntas-ddjj-filter.component.scss'],
})
export class PreguntasDDJJFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('selectOptions') selectOptions: any;

  isCleanButtonDisabled = true;

  constructor() {}

  ngOnInit(): void {
  }

  public search(): void {
    let selectedValue = this.selectOptions?.value || '';
    let body = {
      par_modo: 'C',
      modelo_formulario: selectedValue,
    };
    this.searchEvent.emit(body);
  }

  public clean(): void {
    this.selectOptions.value = '';
  }
}

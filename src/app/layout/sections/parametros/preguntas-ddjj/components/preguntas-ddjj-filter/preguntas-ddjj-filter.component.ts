import { Component, EventEmitter, Output } from '@angular/core';

// * Services
import { PreguntasDDJJService } from 'src/app/core/services/preguntas-ddjj.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-preguntas-ddjj-filter',
  templateUrl: './preguntas-ddjj-filter.component.html',
  styleUrls: ['./preguntas-ddjj-filter.component.scss'],
})
export class PreguntasDDJJFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private preguntasDDJJService: PreguntasDDJJService,
    private utils: UtilService
  ) {}

  ngOnInit(): void {}

  models: any[] = [];

  public search(event: any, value: string): void {
    event.preventDefault();
    let body = {
      par_modo: 'C',
      modelo_formulario: value,
    };
    this.searchEvent.emit(body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
  }

  searchModels(): any {
    // this.utils.openLoading();
    this.preguntasDDJJService
      .getPreguntasDDJJCRUD(JSON.stringify({ par_modo: 'C', modelo_formulario: '' }))
      .subscribe((res: any) => {
        for (let i = 0; i < res.dataset.length; i++) {
          this.models.push(res.dataset[i]);
        }
        // this.utils.closeLoading();
      });
  }
}

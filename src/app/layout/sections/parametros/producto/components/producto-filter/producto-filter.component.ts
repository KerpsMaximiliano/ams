import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

// * Services
import { ProductoService } from 'src/app/core/services/producto.service';

@Component({
  selector: 'app-producto-filter',
  templateUrl: './producto-filter.component.html',
  styleUrls: ['./producto-filter.component.scss'],
})

export class ProductoFilterComponent implements OnInit {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('selectOptions') selectOptions: any;
  empresas: IEmpresa[] = [];

  constructor(private productoService: ProductoService){ }

  ngOnInit(): void {
    this.getEmpresas();
    
    
  }

  public getEmpresas(): void{
    this.productoService.getProductoCRUD(JSON.stringify({ par_modo: "R", descripcion: ""})).subscribe({
      next: (res: any) => {
        (res.dataset.length)
          ? this.empresas = res.dataset as IEmpresa[]
          : this.empresas = [res.dataset];
      }
    });
  }

  public search(event: any, inputValue: string): void {
    event.preventDefault();
    let body = {
      par_modo: "P",
      descripcion_producto: inputValue,
      // descripcion_reducida: this.selectOptions?.value || '',           // ! VERIFICAR
    };
    this.searchEvent.emit(body);
    console.log(body);
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.selectOptions.value = '';
  }
}

interface IEmpresa {
  par_modo: string;
  empresa_factura: number;
  descripcion: string;
}
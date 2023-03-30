import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProvinciaFilterComponent } from './tipo-provincia-filter.component';

describe('TipoProvinciaFilterComponent', () => {
  let component: TipoProvinciaFilterComponent;
  let fixture: ComponentFixture<TipoProvinciaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoProvinciaFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProvinciaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

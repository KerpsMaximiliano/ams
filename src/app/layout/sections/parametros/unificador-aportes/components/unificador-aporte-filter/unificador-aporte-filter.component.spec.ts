import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnificadorAporteFilterComponent } from './unificador-aporte-filter.component';

describe('UnificadorAporteFilterComponent', () => {
  let component: UnificadorAporteFilterComponent;
  let fixture: ComponentFixture<UnificadorAporteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnificadorAporteFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnificadorAporteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

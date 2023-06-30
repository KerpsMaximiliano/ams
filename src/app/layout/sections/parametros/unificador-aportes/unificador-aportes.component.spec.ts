import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnificadorAportesComponent } from './unificador-aportes.component';

describe('UnificadorAportesComponent', () => {
  let component: UnificadorAportesComponent;
  let fixture: ComponentFixture<UnificadorAportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnificadorAportesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnificadorAportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

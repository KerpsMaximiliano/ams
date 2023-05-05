import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDepartamentoComponent } from './departamento.component';

describe('AbmDepartamentoComponent', () => {
  let component: AbmDepartamentoComponent;
  let fixture: ComponentFixture<AbmDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmDepartamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

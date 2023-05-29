import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmPosicionesComponent } from './abm-posiciones.component';

describe('AbmPosicionesComponent', () => {
  let component: AbmPosicionesComponent;
  let fixture: ComponentFixture<AbmPosicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmPosicionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmPosicionesFilterComponent } from './abm-posiciones-filter.component';

describe('AbmPosicionesFilterComponent', () => {
  let component: AbmPosicionesFilterComponent;
  let fixture: ComponentFixture<AbmPosicionesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmPosicionesFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmPosicionesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

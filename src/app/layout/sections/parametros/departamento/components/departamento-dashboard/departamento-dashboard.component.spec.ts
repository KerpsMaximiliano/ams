import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDepartamentoDashboardComponent } from './departamento-dashboard.component';

describe('AbmDepartamentoDashboardComponent', () => {
  let component: AbmDepartamentoDashboardComponent;
  let fixture: ComponentFixture<AbmDepartamentoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmDepartamentoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmDepartamentoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

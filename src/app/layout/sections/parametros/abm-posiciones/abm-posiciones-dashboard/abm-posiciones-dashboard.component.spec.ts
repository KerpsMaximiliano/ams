import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmPosicionesDashboardComponent } from './abm-posiciones-dashboard.component';

describe('AbmPosicionesDashboardComponent', () => {
  let component: AbmPosicionesDashboardComponent;
  let fixture: ComponentFixture<AbmPosicionesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmPosicionesDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmPosicionesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

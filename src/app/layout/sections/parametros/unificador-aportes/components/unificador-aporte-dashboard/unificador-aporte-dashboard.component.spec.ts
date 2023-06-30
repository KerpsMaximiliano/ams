import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnificadorAporteDashboardComponent } from './unificador-aporte-dashboard.component';

describe('UnificadorAporteDashboardComponent', () => {
  let component: UnificadorAporteDashboardComponent;
  let fixture: ComponentFixture<UnificadorAporteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnificadorAporteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnificadorAporteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

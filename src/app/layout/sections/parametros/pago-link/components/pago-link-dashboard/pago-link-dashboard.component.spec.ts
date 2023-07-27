import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoLinkDashboardComponent } from './pago-link-dashboard.component';

describe('PagoLinkDashboardComponent', () => {
  let component: PagoLinkDashboardComponent;
  let fixture: ComponentFixture<PagoLinkDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoLinkDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoLinkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

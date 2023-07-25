import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoLinkComponent } from './pago-link.component';

describe('PagoLinkComponent', () => {
  let component: PagoLinkComponent;
  let fixture: ComponentFixture<PagoLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

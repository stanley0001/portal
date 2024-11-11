import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycResultComponent } from './kyc-result.component';

describe('KycResultComponent', () => {
  let component: KycResultComponent;
  let fixture: ComponentFixture<KycResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

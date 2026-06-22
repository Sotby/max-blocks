import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerLateral } from './banner-lateral';

describe('BannerLateral', () => {
  let component: BannerLateral;
  let fixture: ComponentFixture<BannerLateral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerLateral],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerLateral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DashboardJogosService } from './dashboard.jogos.service';

describe('DashboardJogosService', () => {
  let service: DashboardJogosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardJogosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

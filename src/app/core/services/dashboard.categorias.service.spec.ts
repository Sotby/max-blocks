import { TestBed } from '@angular/core/testing';

import { DashboardCategoriasService } from './dashboard.categorias.service';

describe('DashboardCategoriasService', () => {
  let service: DashboardCategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Tableservice } from './tableservice';

describe('Tableservice', () => {
  let service: Tableservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tableservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

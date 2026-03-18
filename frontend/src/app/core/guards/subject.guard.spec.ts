import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { subjectGuard } from './subject.guard';

describe('subjectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => subjectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

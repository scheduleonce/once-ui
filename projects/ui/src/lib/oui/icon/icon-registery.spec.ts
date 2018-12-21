import { TestBed, inject } from '@angular/core/testing';

import { IconRegisterService } from './icon-registery';

describe('IconRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconRegisterService]
    });
  });

  it('should be created', inject(
    [IconRegisterService],
    (service: IconRegisterService) => {
      expect(service).toBeTruthy();
    }
  ));
});

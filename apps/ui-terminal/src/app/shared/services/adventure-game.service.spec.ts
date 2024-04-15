import { TestBed } from '@angular/core/testing';

import { AdventureGameService } from './adventure-game.service';

describe('AdventureGameService', () => {
  let service: AdventureGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdventureGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

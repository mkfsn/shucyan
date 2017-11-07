import { TestBed, async, inject } from '@angular/core/testing';

import { ChannelGuard } from './channel.guard';

describe('ChannelGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelGuard]
    });
  });

  it('should ...', inject([ChannelGuard], (guard: ChannelGuard) => {
    expect(guard).toBeTruthy();
  }));
});

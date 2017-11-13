import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGridComponent } from './channel-grid.component';

describe('ChannelGridComponent', () => {
  let component: ChannelGridComponent;
  let fixture: ComponentFixture<ChannelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

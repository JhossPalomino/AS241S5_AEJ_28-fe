import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsList } from './tts-list';

describe('TtsList', () => {
  let component: TtsList;
  let fixture: ComponentFixture<TtsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

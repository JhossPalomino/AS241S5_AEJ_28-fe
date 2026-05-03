import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsModal } from './tts-modal';

describe('TtsModal', () => {
  let component: TtsModal;
  let fixture: ComponentFixture<TtsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

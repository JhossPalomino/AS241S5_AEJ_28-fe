import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateList } from './translate-list';

describe('TranslateList', () => {
  let component: TranslateList;
  let fixture: ComponentFixture<TranslateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

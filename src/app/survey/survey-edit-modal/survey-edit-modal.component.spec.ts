import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEditModalComponent } from './survey-edit-modal.component';

describe('SurveyEditModalComponent', () => {
  let component: SurveyEditModalComponent;
  let fixture: ComponentFixture<SurveyEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InActivityComponent } from './in-activity.component';

describe('InActivityComponent', () => {
  let component: InActivityComponent;
  let fixture: ComponentFixture<InActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

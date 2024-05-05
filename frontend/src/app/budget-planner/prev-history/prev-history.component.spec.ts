import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevHistoryComponent } from './prev-history.component';

describe('PrevHistoryComponent', () => {
  let component: PrevHistoryComponent;
  let fixture: ComponentFixture<PrevHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrevHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrevHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

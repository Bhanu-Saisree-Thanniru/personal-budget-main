import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBudgetComponent } from './config-budget.component';

describe('ConfigBudgetComponent', () => {
  let component: ConfigBudgetComponent;
  let fixture: ComponentFixture<ConfigBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigBudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResButtonComponent } from './res-button.component';

describe('ResButtonComponent', () => {
  let component: ResButtonComponent;
  let fixture: ComponentFixture<ResButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosCardComponent } from './videos-card.component';

describe('VideosCardComponent', () => {
  let component: VideosCardComponent;
  let fixture: ComponentFixture<VideosCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

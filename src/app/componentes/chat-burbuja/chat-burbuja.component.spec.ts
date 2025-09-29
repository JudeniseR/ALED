import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBurbujaComponent } from './chat-burbuja.component';

describe('ChatBurbujaComponent', () => {
  let component: ChatBurbujaComponent;
  let fixture: ComponentFixture<ChatBurbujaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBurbujaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBurbujaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

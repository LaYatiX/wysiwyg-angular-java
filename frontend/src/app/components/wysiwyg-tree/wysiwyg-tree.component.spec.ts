import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygTreeComponent } from './wysiwyg-tree.component';

describe('WysiwygTreeComponent', () => {
  let component: WysiwygTreeComponent;
  let fixture: ComponentFixture<WysiwygTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

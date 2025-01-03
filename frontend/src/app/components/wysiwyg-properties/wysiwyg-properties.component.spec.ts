import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WysiwygPropertiesComponent } from './wysiwyg-properties.component';

describe('WysiwygPropertiesComponent', () => {
  let component: WysiwygPropertiesComponent;
  let fixture: ComponentFixture<WysiwygPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WysiwygPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

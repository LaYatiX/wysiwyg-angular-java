import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-wysiwyg-properties',
  imports: [
    MatButton
  ],
  templateUrl: './wysiwyg-properties.component.html',
  styleUrl: './wysiwyg-properties.component.scss'
})
export class WysiwygPropertiesComponent {
  @Output() saveContent = new EventEmitter()
  @Input() selectedNode!: HTMLElement | null | undefined;

  save() {
    this.saveContent.emit()
  }

  get nodeStyles() {
      return this.selectedNode ? getComputedStyle(this.selectedNode) : null
  }
}

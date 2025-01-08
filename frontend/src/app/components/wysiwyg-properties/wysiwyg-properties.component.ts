import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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

  inputChanged($event: Event, field: string) {
    this.selectedNode?.style.setProperty(field, ($event.target as HTMLInputElement).value)
  }

  rgbToHex(rgb: string) {
    const rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    let result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
      r = this.componentFromStr(result[1], result[2]);
      g = this.componentFromStr(result[3], result[4]);
      b = this.componentFromStr(result[5], result[6]);

      hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
  }

  componentFromStr(numStr: string, percent: string) {
    const num = Math.max(0, parseInt(numStr, 10));
    return percent ?
      Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
  }
}

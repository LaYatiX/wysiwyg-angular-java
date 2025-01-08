import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { Editor } from 'tinymce';

const tagMap: Record<string, string> = {
  table: 'Table',
  tr: 'Row',
  td: 'Col',
  col: 'Col',
  img: 'Image'
}

export type Structure = {
  tag: string;
  children: Structure[];
  node: Element;
}

export type SelectionType = {
  rawHTML: string;
  structure: Structure[];
  selectedNode?: HTMLElement
}

@Component({
  selector: 'app-wysiwyg-editor',
  imports: [EditorComponent],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrl: './wysiwyg-editor.component.scss'
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy {
  @Input() rawContent: string | undefined
  @Output() onSelectionChange = new EventEmitter<SelectionType>()
  @Output() onEditorInit = new EventEmitter<Editor>()
  editor: Editor | null = null;
  previousSelectedNode: Node | null = null;
  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    height: 600,
    setup: (editor: Editor) => {
      this.editor = editor;
      this.onEditorInit.emit(editor)
      editor.on('NodeChange', (e) => {
        this.applySelectionStyle();
        this.applyDragListeners();
        this.onSelectionChange.emit(this.getEditorContent())
        e.preventDefault();
      });
      editor.on('blur', () => {
        const body = this.editor?.dom.select('body')[0]
        if(body)
          this.deselectNode(body)
      });
      editor.on('init', () => {
        if(this.editor){
          this.editor.setContent(this.rawContent || '');
          const body = this.editor.dom.select('body')[0]
          this.deselectNode(body)
          this.onSelectionChange.emit(this.getEditorContent())
        }
      })
    },
  };

  ngAfterViewInit(): void {
    if (this.editor) {
      const body = this.editor.dom.select('body')[0]
      this.deselectNode(body)
    }
  }

  deselectNode(body: HTMLElement) {
    body.style.backgroundColor = '';
    [...body.children].forEach((node) => this.deselectNode(node as HTMLElement))
  }

  getEditorContent(): SelectionType {
    if (this.editor) {
      const body = this.editor.dom.select('body')

      return {
        rawHTML: this.editor.getContent({ format: 'raw' }),
        structure: this.domToStructure(body[0]),
        selectedNode: this.editor.selection.getNode() as HTMLElement
      }
    }
    throw new Error()
  }

  domToStructure(element: Element): Structure[] {
    return [...element.children].filter(child => !child.classList.contains('mce-resizehandle')).map((child: Element) => {
        return {
          node: child,
          tag: child.tagName.toLowerCase(),
          children: this.domToStructure(child),
        }
      })
  }

  applySelectionStyle() {
    if (this.editor) {
      const selectedNode = this.editor.selection.getNode();
      if (selectedNode && selectedNode !== this.previousSelectedNode) {

        this.removeSelectionStyle(); // Remove style from previously selected node

        if (selectedNode.nodeType === Node.ELEMENT_NODE) {
          (selectedNode as HTMLElement).style.backgroundColor = 'lightblue'; // Apply style
          this.previousSelectedNode = selectedNode;
        }
      }
    }
  }

  removeSelectionStyle(){
    if(this.previousSelectedNode && this.previousSelectedNode.nodeType === Node.ELEMENT_NODE){
      (this.previousSelectedNode as HTMLElement).style.backgroundColor = '';
      this.previousSelectedNode = null;
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  private applyDragListeners() {
    if (this.editor) {
      const elements = this.editor.dom.select('body *');
      elements.forEach((element) => {
        element.setAttribute('draggable', 'true');
        const relative = {x: 0, y: 0}
        element.addEventListener('dragstart', (event) => {
          relative.x = event.layerX;
          relative.y = event.layerY;
        });
        element.addEventListener('dragend', (event) => {
          (event.target as HTMLElement).style.position = 'absolute';
          (event.target as HTMLElement).style.top = event.pageY - relative.y + 'px';
          (event.target as HTMLElement).style.left = event.pageX - relative.x + 'px';
        });
      });
    }
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { Editor } from 'tinymce';

export type Structure = {
  tag: string;
  children: Structure[];
  text: string;
  node: Element;
  active?: boolean
}

export type SelectionType = {
  rawHTML: string;
  structure: Structure;
  selectedPath: number[];
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
  editor: Editor | null = null;
  previousSelectedNode: Node | null = null;
  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    height: 600,
    setup: (editor: Editor) => {
      this.editor = editor;
      editor.on('NodeChange', (e) => {
        this.applySelectionStyle();
        this.removeSelectionStyle();
        this.onSelectionChange.emit(this.getEditorContent())
      });
      editor.on('blur', () => {
        this.removeSelectionStyle();
      });
      editor.on('init', () => {
        if(this.editor){
          this.editor.setContent(this.rawContent || '');
        }
      })
    },
  };

  getSelectedPath(){
    if (this.editor) {
      const selectedNode = this.editor.selection.getNode();
      if (selectedNode) {
        return this.getNodePath(selectedNode);
      }
    }
    return []
  }

  ngAfterViewInit(): void {
    if (this.editor) {
      this.getEditorContent();
    }
  }

  getEditorContent(): SelectionType {
    if (this.editor) {
      const content = this.editor.getContent({format: 'html'}); // Get content as HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      return {
        rawHTML: this.editor.getContent({ format: 'raw' }),
        structure: this.domToStructure(doc.body),
        selectedPath: this.getSelectedPath(),
        selectedNode: this.editor.selection.getNode()
      }
    }
    throw new Error()
  }

  domToStructure(element: Element): any {
    const structure: any = {
      tag: element.tagName.toLowerCase(),
      children: [],
      node: null,
      active: false
    };

    if (element.childNodes) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.TEXT_NODE) {
          if (child.textContent?.trim() !== "") {
            structure.text = child.textContent?.trim();
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          structure.node = child;
          structure.active = (child as Element).classList.contains('active');
          structure.children.push(this.domToStructure(child as Element));
        }
      }
    }

    return structure;
  }

  getNodePath(node: Node) {
    const indexes = []
    let path = '';
    while (node) {
      let nodeName = node.nodeName.toLowerCase();
      if(node.nodeType === Node.TEXT_NODE){
        nodeName = "#text"
      }
      if (node.parentNode && node.parentNode.childNodes) {
        let index = 0;
        for (let i = 0; i < node.parentNode.childNodes.length; i++) {
          if (node.parentNode.childNodes[i] === node) {
            index = i;
            break;
          }
        }
        nodeName += `[${index}]`;
        indexes.push(index)
      }
      path = nodeName + (path ? ' > ' + path : '');
      node = node.parentNode!;
    }
    return indexes;
  }

  applySelectionStyle() {
    if (this.editor) {
      const selectedNode = this.editor.selection.getNode();
      if(selectedNode)
        selectedNode.nonce = 'active'
      if (selectedNode && selectedNode !== this.previousSelectedNode) {

        this.removeSelectionStyle(); // Remove style from previously selected node

        if (selectedNode.nodeType === Node.ELEMENT_NODE) {
          (selectedNode as HTMLElement).style.backgroundColor = 'lightblue'; // Apply style
          (selectedNode as HTMLElement).classList.add('active');
        }

        if (this.previousSelectedNode?.nodeType === Node.ELEMENT_NODE) {
          (this.previousSelectedNode as HTMLElement).classList.remove('active')
        }

        this.previousSelectedNode = selectedNode;
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
}

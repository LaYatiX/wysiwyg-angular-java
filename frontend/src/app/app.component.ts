  import { Component, OnInit } from '@angular/core';
import { WysiwygTreeComponent } from './components/wysiwyg-tree/wysiwyg-tree.component';
import { SelectionType, Structure, WysiwygEditorComponent } from './components/wysiwyg-editor/wysiwyg-editor.component';
import { WysiwygPropertiesComponent } from './components/wysiwyg-properties/wysiwyg-properties.component';
import { WysiwygService } from './services/WysiwygService';
import { BehaviorSubject, map } from 'rxjs';
import { WysiwygContent } from './model/Wysiwyg.model';
  import { AsyncPipe } from '@angular/common';
  import { Editor } from 'tinymce';

const defaultWysiwyg = {
  content: '',
  description: 'DESC',
  name: 'name'
}

@Component({
  selector: 'app-root',
  imports: [WysiwygTreeComponent, WysiwygEditorComponent, WysiwygPropertiesComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [WysiwygService]
})
export class AppComponent implements OnInit {
  currentItem$ = new BehaviorSubject<WysiwygContent | null>(null)
  currentStructure$ = new BehaviorSubject<Structure[]>([])
  selectedNode$ = new BehaviorSubject<HTMLElement | null | undefined>(null)
  editor: Editor | null = null;

  constructor(private wysiwygService: WysiwygService) {
  }

  ngOnInit(): void {
    this.wysiwygService.getAll().pipe(map(value => value)).subscribe(value => {
      this.currentItem$.next(value[0] || defaultWysiwyg);
    })
  }

  handleSelectionChange({rawHTML, structure, selectedNode}: SelectionType) {
    this.currentStructure$.next(structure)
    this.selectedNode$.next(selectedNode)
    if(this.currentItem$.value)
      this.currentItem$.next({
        ...this.currentItem$.value,
        content: rawHTML
      })
  }

  saveContent() {
    this.wysiwygService.save(this.currentItem$.value || defaultWysiwyg).subscribe()
  }

  nodeSelected(node: HTMLElement) {
    if (this.editor) {
      const body = this.editor.dom.select('body')[0]
      this.deselectNode(body)
      node.style.backgroundColor = 'lightblue';
    }
  }

  initEditor(editor: Editor) {
    this.editor = editor;
  }

  deselectNode(body: HTMLElement) {
    body.style.backgroundColor = '';
    [...body.children].forEach((node) => this.deselectNode(node as HTMLElement))
  }
}


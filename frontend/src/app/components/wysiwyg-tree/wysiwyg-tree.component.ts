import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle } from '@angular/material/tree';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Structure } from '../wysiwyg-editor/wysiwyg-editor.component';

@Component({
  selector: 'app-wysiwyg-tree',
  imports: [
    MatTree,
    MatTreeNode,
    MatIcon,
    MatIconButton,
    MatTreeNodeToggle,
    MatTreeNodePadding,
    MatTreeNodeDef,
  ],
  templateUrl: './wysiwyg-tree.component.html',
  styleUrl: './wysiwyg-tree.component.scss'
})
export class WysiwygTreeComponent {
  dataStructure$ = new BehaviorSubject<Structure[]>([])
  activeElementPath$ = new BehaviorSubject<number[] | null>([])

  @ViewChild('tree') tree: MatTree<Structure, Structure[]> | undefined
  @Input() selectedNode!: HTMLElement | null | undefined;

  @Input() set structure(data: Structure[] | null) {
    this.dataStructure$.next(data || [])
    this.tree?.expandAll()
  }

  @Output() onNodeClick = new EventEmitter<HTMLElement>()

  childrenAccessor = (node: Structure) => {
    return node.children
  };
  hasChild = (_: number, node: Structure) => node?.children?.length > 0;

  setActiveElement(node: Structure) {
    this.onNodeClick.emit(node.node as HTMLElement);
  }
}

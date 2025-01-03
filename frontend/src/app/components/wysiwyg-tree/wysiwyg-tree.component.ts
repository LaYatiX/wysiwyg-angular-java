import { Component, Input, ViewChild } from '@angular/core';
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle } from '@angular/material/tree';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Structure } from '../wysiwyg-editor/wysiwyg-editor.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

interface TreeNode {
  name: string;
  children?: TreeNode[];
  node: Element;
  active?: boolean
}

const tagMap: Record<string, string> = {
  table: 'Table',
  tr: 'Row',
  td: 'Col',
  col: 'Col',
  img: 'Image'
}

const mapTagToName = (tag: string) => {
  return tagMap[tag] || ''
}

const mapStructureToTreeNode = (structure: Structure): TreeNode => {
  const text = mapTagToName(structure?.tag) || structure.text || structure?.tag
  return {
    active: structure.active,
    node: structure.node,
    name: text,
    children: structure.children?.map(value => mapStructureToTreeNode(value)),
  }
}

@Component({
  selector: 'app-wysiwyg-tree',
  imports: [
    MatTree,
    MatTreeNode,
    MatIcon,
    MatIconButton,
    MatTreeNodeToggle,
    MatTreeNodePadding,
    AsyncPipe,
    NgIf,
    MatTreeNodeDef,
    JsonPipe,
  ],
  templateUrl: './wysiwyg-tree.component.html',
  styleUrl: './wysiwyg-tree.component.scss'
})
export class WysiwygTreeComponent {
  dataStructure$ = new BehaviorSubject<Structure | null>(null)
  activeElementPath$ = new BehaviorSubject<number[] | null>([])

  @ViewChild('tree') tree: MatTree<TreeNode, TreeNode> | undefined
  @Input() selectedNode!: HTMLElement | null | undefined;

  @Input() set structure(data: Structure | null) {
    this.dataStructure$.next(data)
    this.tree?.expandAll()
  }

  @Input() set activeElementPath(path: number[]) {
    this.activeElementPath$.next(path)
    this.dataStructure$.value
  }

  dataSource$ = this.dataStructure$.pipe(filter(Boolean), map(value => {
    return ((value.children || []).map(mapStructureToTreeNode) as TreeNode[])
  }));

  childrenAccessor = (node: TreeNode) => node.children ?? [];
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
}

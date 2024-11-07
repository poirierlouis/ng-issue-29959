import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from '@angular/material/tree';
import {MatIcon} from '@angular/material/icon';

interface FileEntity {
  readonly name: string;
  readonly children?: FileEntity[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTree, MatTreeNode, MatTreeNodeDef, MatIcon, MatTreeNodePadding, MatTreeNodeToggle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('console')
  console!: ElementRef;

  selectedNode?: FileEntity;

  dataSource: FileEntity[] = [
    {
      name: '/',
      children: [
        { name: '.htaccess' },
        {
          name: 'home',
          children: [
            { name: '.bashrc' },
            { name: 'index.html' },
            { name: '404.html' },
            { name: 'AngularIsTheWay.html' },
            { name: 'MaterialIsGreat.css' },
            { name: 'WhenItDoesntBreak.ts' },
            { name: 'Smiley.thx' },
          ],
        },
      ],
    },
  ];

  private get $console(): HTMLTextAreaElement {
    return this.console.nativeElement;
  }

  trackBy = (_: number, node: FileEntity) => node.name;

  childrenAccessor = (node: FileEntity) =>
    !!node.children ? node.children : [];

  isFolder = (node: FileEntity) => !!node.children;

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      const root = this.dataSource[0];
      const home = root.children![1];

      if (home.children!.length === 0) {
        this.log('<error message="/home/ is empty, reload to try again..." />');
        return;
      }
      const removed = home.children!.splice(home.children!.length - 1, 1);
      const move = removed[0];

      root.children!.push(move);
      this.dataSource = [...this.dataSource];
      this.log(`<moved file="/home/${move.name}" to="/${move.name}" />`);
    }
  }

  protected log(message: string): void {
    let text: string = this.$console.textContent ?? '';

    text += `${message.trim()}\r\n`;
    this.$console.textContent = text;
  }
}

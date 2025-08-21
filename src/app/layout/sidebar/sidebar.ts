import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/company-list" routerLinkActive="active">
        <mat-icon>list</mat-icon>
        <span>Company List</span>
      </a>
      <a mat-list-item routerLink="/new-company" routerLinkActive="active">
        <mat-icon>add</mat-icon>
        <span>New Company</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    a.active { background: #e0e0e0; }
  `]
})
export class SidebarComponent {}

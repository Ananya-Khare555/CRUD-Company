import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent {
  constructor(private router: Router) {}
  go() {
    this.router.navigate(['/company-list']);
  }
}

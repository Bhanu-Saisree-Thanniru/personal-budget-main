import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  isSlideOut = true;
  constructor(private router: Router) {}

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }
  onDash() {
    this.router.navigate(['/budget/dashboard']);
  }
  onProfile() {
    this.router.navigate(['/budget/profile']);
  }
  onHistory() {
    this.router.navigate(['/budget/history']);
  }
  onLogout() {
    this.router.navigate(['/budget/login']);
  }
}

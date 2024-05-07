import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  constructor(private router: Router) {}

  onDash() {
    this.router.navigate(['/budget/dashboard']);
  }
  onProfile() {
    this.router.navigate(['/budget/profile']);
  }
  onHistory() {
    this.router.navigate(['/budget/history']);
  }
  onSignOut() {
    this.router.navigate(['/budget/logout']);
  }
}

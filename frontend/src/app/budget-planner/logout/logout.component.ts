import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  onLogout(): void {
    this.matSnackBar
      .open('You have been successfully logged out', 'Close', {
        duration: 10000,
        panelClass: ['snackbar-success'],
      })
      .afterDismissed()
      .subscribe(() => {
        this.router.navigate(['/budget/login']);
      });
}
}

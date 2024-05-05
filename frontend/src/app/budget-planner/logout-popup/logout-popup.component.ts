// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-logout-popup',
//   templateUrl: './logout-popup.component.html',
//   styleUrl: './logout-popup.component.scss'
// })
// export class LogoutPopupComponent {

// }

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss'],
})
export class LogoutPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
        this.router.navigate(['/login']);
      });
  }
}

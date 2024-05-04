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

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss'],
})
export class LogoutPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onLogout(): void {
    this.dialogRef.close('logout');
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}

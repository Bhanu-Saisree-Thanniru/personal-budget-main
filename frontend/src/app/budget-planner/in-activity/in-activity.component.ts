import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-in-activity',
  templateUrl: './in-activity.component.html',
  styleUrl: './in-activity.component.scss'
})
export class InActivityComponent {
  constructor(public dialogRef: MatDialogRef<InActivityComponent>) {}
  refresh(): void {
    this.dialogRef.close('refresh');
  }
}

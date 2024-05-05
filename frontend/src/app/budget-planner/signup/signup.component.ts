import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private router: Router, private matSnackBar: MatSnackBar) {}

  navToLogin(): void {
    this.router.navigate(['/budget/login']);
  }

  signUp(): void {
    this.matSnackBar.open('Signup Successful', 'Close', {
      duration: 2000,
    });

    // Navigate to the login page after a delay
    setTimeout(() => {
      this.router.navigate(['/budget/login']);
    }, 2000);
  }
}

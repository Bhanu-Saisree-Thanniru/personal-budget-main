import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { response } from 'express';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm!: FormGroup;
  signupError!: string;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, private matSnackBar: MatSnackBar) {}

  navToLogin(): void {
    this.router.navigate(['/budget/login']);
  }
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.email,Validators.required]],
      password: ['',Validators.required],
    });
  }


  signUp(): void {
      if (this.signupForm.valid) {
        const email = this.signupForm.get('email')!.value;
        const password = this.signupForm.get('password')!.value;
        this.authService.register({ email, password })
        .subscribe((response) => {
          console.log("response: " + response);
          this.matSnackBar.open('Signup Successful', 'Close', {
            duration: 2000,
          });
          setTimeout(() => {
            this.router.navigate(['/budget/login'])
          }, 2000);
          this.router.navigate(['/budget/login']);
        },
        error => {
            console.log(error);
            if (error) {
              this.signupError = 'An error occurred. Please try again later.';
          }
        }
      );
      } else {
        this.signupError = 'Please enter valid email and password.';
      }
    }





}

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { error } from 'console';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  myForm!: FormGroup;
  loginError!: string;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {

  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.email,Validators.required]],
      password: ['',Validators.required],
    });
  }

  // login(){
    // if(this.myForm.valid){
    //   this.authService.signIn(this.myForm.value)
    //   .subscribe({
    //     next: () => {
    //       const user = firebase.auth().currentUser;
    //       const firebaseUserId = user ? user.uid : null;
    //       console.log('firebaseUserId :' + firebaseUserId);
    //       this.router.navigate(['/budget/dashboard']);
    //     }
    //   }
        // (response => {
        //   console.log("response: " + response);
        //   const user = firebase.auth().currentUser;
        //   const firebaseUserId = user ? user.uid : null;
        //   this.router.navigate(['/budget/dashboard']);
        // }),
    //   error => { console.log("Error: " + error); }
    // )
    // }
    // console.log("my form value: " + this.myForm.value);

    // const user = firebase.auth().currentUser;
    // const firebaseUserId = user ? user.uid : null;
 // }
 login() {
  if (this.myForm.valid) {
    const email = this.myForm.get('email')!.value;
    const password = this.myForm.get('password')!.value;

    this.authService.signIn({ email, password }).subscribe({
      next: () => {
        // Get the current user and UID after successful login
        const user = firebase.auth().currentUser;
        const firebaseUserId = user ? user.uid : '';
        console.log('firebaseUserId :' + firebaseUserId);
        this.authService.setFirebaseUserId(firebaseUserId);
        // Navigate to dashboard on successful login
        this.router.navigate(['/budget/dashboard']);
      },
      error: (error) => {
        console.log(error);
        // Handle specific login errors (e.g., invalid credentials)
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          this.loginError = 'Incorrect email or password.';
        } else {
          this.loginError = 'An error occurred. Please try again later.';
        }
      },
    });
  } else {
    // If form is invalid, display error message
    this.loginError = 'Please enter valid email and password.';
  }
}

signUp(){
  this.authService.register(this.myForm.value).subscribe(
    (response) => response,
  error => console.log(error)
  )}
}

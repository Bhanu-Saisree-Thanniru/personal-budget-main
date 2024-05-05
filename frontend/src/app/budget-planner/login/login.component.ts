import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { error } from 'console';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

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
      next: async () => {
        // Get the current user and UID after successful login
        const user = firebase.auth().currentUser;
        if (user) {
          const authToken = await user.getIdToken();
          localStorage.setItem("authToken", authToken);
        }
        this.inActivityTimerStart();
        const firebaseUserId = user ? user.uid : '';
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
  this.router.navigate(['/budget/signup']);
}

inActivityTimerStart(){
  const inactivityTimeLimit = 50 * 100000;

    let timerId = setTimeout(() => this.logout(), inactivityTimeLimit);

    // Reset the timer whenever there's any activity
    window.onmousemove = window.onkeypress = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => this.logout(), inactivityTimeLimit);
    };
  }

  logout() {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Log the user out
    this.authService.signOut();

    // Navigate back to the login page
    this.router.navigate(['/budget/login']);
  }
}
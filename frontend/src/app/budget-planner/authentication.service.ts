// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {

//   constructor() { }
// }


import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { error } from 'console';
import { response } from 'express';
import { Observable, Subject, catchError, from, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private afireAuth: AngularFireAuth) { }

  userId!: string;

  signIn(params: SignIn): Observable<any>{
    return from(this.afireAuth.signInWithEmailAndPassword(
      params.email,
      params.password
    ).then(
      (id) => {
        console.log("Sign in successful");
        const token = id.user?.getIdToken();
        return token;
      }
    ).catch((error) => {
      console.log("Error: " + error.message);
      throw error;
    }));
  }

  signOut(){
    return from(
      this.afireAuth.signOut().then(() => {
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        throw error;
      })
    );
  }

  recoverPassword(email: string): Observable<any>{
    console.log("return: " + this.afireAuth.sendPasswordResetEmail(email));
    return from(this.afireAuth.sendPasswordResetEmail(email)
      .then(() => {
      console.log("Reset mail sent successfully");
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
       // Handle the case where the email doesn't belong to an existing user
          console.error('User not found for email:', email);
          // Display an error message to the user or handle it as needed
          } else {
              // Handle other errors
              console.error('Error sending password reset email:', error);
              // Display an error message to the user or handle it as needed
            }
        }));
  }

  register(params: SignIn): Observable<any>{
    const promise = this.afireAuth.createUserWithEmailAndPassword(
      params.email,
      params.password).then((response) =>
        console.log("response : " + response));
      return from(promise);
  }

  setFirebaseUserId(userId: string) {
    console.log("auth service set User id: "+ userId);
    this.userId = userId;
  }

  getFirebaseUserId() {
   console.log("auth service set User id: "+ this.userId);
   return this.userId;
  }

}

type SignIn = {
  email: string;
  password: string;
}

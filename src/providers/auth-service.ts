import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth) {
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }
  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }
  loginUser(newEmail: string, newPassword: string): any {
    return this.auth$.login({
      email: newEmail,
      password: newPassword
    });
  }
  signOut(): void {
    this.auth$.logout();
  }
  signupUser(newEmail: string, newPassword: string): any {
    return this.auth$.createUser({ 
      email: newEmail, 
      password: newPassword 
    });
  }
  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }
}

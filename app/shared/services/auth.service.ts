import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  get currentUser() {
    return new Observable((subscriber) => {
      this.auth.currentUser
        .then((user) => {
          subscriber.next(user);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  get isAuthenticated(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.auth.authState.subscribe((user) => {
        subscriber.next(!!user);
      });
    });
  }

  async updateCurrentUser(user: firebase.default.User | null) {
    return await this.auth.updateCurrentUser(user);
  }

  async register(
    email: string,
    password: string
  ): Promise<firebase.default.auth.UserCredential> {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  }

  async login(
    email: string,
    password: string
  ): Promise<firebase.default.auth.UserCredential> {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout(): Promise<void> {
    return await this.auth.signOut();
  }
}

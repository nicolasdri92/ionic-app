import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '@shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router) {}

  canActivate() {
    return this._auth.isAuthenticated.pipe(
      map((user) => {
        return !!user ? true : this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}

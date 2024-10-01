import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: '.root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private _auth: AuthService) {}

  ngOnInit(): void {
    this._auth.isAuthenticated.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/main/home']);
      }
    });
  }
}

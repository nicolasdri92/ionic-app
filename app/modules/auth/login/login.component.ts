import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: '.login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private _auth: AuthService,
    private _toast: ToastService
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    this._auth
      .login(this.email?.value, this.password?.value)
      .then(() => {
        this.router.navigate(['/main/home']);
      })
      .catch(async (err: firebase.default.FirebaseError) => {
        await this.presentToast(err.code);
      });
  }

  private async presentToast(code: string): Promise<void> {
    let message: string;

    switch (code) {
      case 'auth/invalid-credential':
        message =
          'La credencial de autenticación proporcionada es incorrecta, tiene un formato incorrecto o ha caducado.';
        break;
      default:
        message = 'Ocurrió un problema durante la autenticación.';
        break;
    }

    let icon: string = 'alert-circle-outline';
    let color: string = 'danger';

    this._toast.create(message, icon, color);
  }

  async signInWithCredential(): Promise<void> {
    let message: string = 'Integración no implementada.';
    let icon: string = 'warning-outline';
    let color: string = 'warning';

    this._toast.create(message, icon, color);
  }

  get email(): AbstractControl<any, any> | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }
}

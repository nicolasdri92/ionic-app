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
  selector: '.register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private _auth: AuthService,
    private _toast: ToastService
  ) {}

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  onSubmit(): void {
    this._auth
      .register(this.email?.value, this.password?.value)
      .then(() => {
        this._auth.currentUser.subscribe(async (user: any) => {
          if (user) {
            await user.updateProfile({ displayName: this.name?.value });
            await this._auth.updateCurrentUser(user);
          }
        });
        this.router.navigate(['/auth/login']);
      })
      .catch(async (err: firebase.default.FirebaseError) => {
        await this.presentToast(err.code);
      });
  }

  private async presentToast(code: string): Promise<void> {
    let message: string;

    switch (code) {
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      case 'auth/email-already-in-use':
        message = 'El correo electrónico ya está en uso en otra cuenta.';
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
    return this.registerForm.get('email');
  }

  get name(): AbstractControl<any, any> | null {
    return this.registerForm.get('name');
  }

  get password(): AbstractControl<any, any> | null {
    return this.registerForm.get('password');
  }
}

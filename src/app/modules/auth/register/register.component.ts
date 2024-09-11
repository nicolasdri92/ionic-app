import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private router: Router) {}

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repassword: new FormControl('', Validators.required),
  });

  onSubmit(): void {
    console.log(this.formGroup.value);
    this.router.navigate(['/auth/login']);
  }

  get name(): any {
    return this.formGroup.get('name');
  }

  get lastname(): any {
    return this.formGroup.get('lastname');
  }

  get email(): any {
    return this.formGroup.get('email');
  }

  get password(): any {
    return this.formGroup.get('password');
  }

  get repassword(): any {
    return this.formGroup.get('repassword');
  }
}

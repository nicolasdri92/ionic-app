import { NgModule } from '@angular/core';
import { LoginComponent } from '@modules/auth/login/login.component';
import { RegisterComponent } from '@modules/auth/register/register.component';
import { SharedModule } from '@shared/shared.module';
import { AuthPageRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';

@NgModule({
  declarations: [AuthPage, LoginComponent, RegisterComponent],
  imports: [SharedModule, AuthPageRoutingModule],
})
export class AuthPageModule {}

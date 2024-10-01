import { NgModule } from '@angular/core';
import { EventComponent } from '@modules/main/event/event.component';
import { HomeComponent } from '@modules/main/home/home.component';
import { ProfileComponent } from '@modules/main/profile/profile.component';
import { SharedModule } from '@shared/shared.module';
import { MainPageRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';
import { ModalComponent } from '@shared/components/modal/modal.component';

@NgModule({
  declarations: [
    MainPage,
    EventComponent,
    HomeComponent,
    ProfileComponent,
    ModalComponent,
  ],
  imports: [SharedModule, MainPageRoutingModule],
})
export class MainPageModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { EventComponent } from "@modules/main/event/event.component";
import { GoogleMapsComponent } from "@modules/main/google-maps/google-maps.component";
import { HomeComponent } from "@modules/main/home/home.component";
import { ProfileComponent } from "@modules/main/profile/profile.component";
import { SharedModule } from "@shared/shared.module";
import { MainPageRoutingModule } from "./main-routing.module";
import { MainPage } from "./main.page";
import { ModalComponent } from "@shared/components/modal/modal.component";

@NgModule({
  declarations: [
    MainPage,
    EventComponent,
    GoogleMapsComponent,
    HomeComponent,
    ProfileComponent,
    ModalComponent,
  ],
  imports: [SharedModule, MainPageRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPageModule {}

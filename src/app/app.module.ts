import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '@env/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(),
    ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

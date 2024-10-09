import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp({
      projectId: 'event-ionic-app-99c14',
      appId: '1:453647551823:web:7e47ecf7ef26101d7e093a',
      storageBucket: 'event-ionic-app-99c14.appspot.com',
      apiKey: 'AIzaSyBjLcpgxulBTZjTFze2UZXZ15fJugXWKKM',
      authDomain: 'event-ionic-app-99c14.firebaseapp.com',
      messagingSenderId: '453647551823',
      measurementId: 'G-YR58MXQ8DP',
    }),
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

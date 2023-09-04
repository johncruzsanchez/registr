import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// =====fire ======
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import{ AngularFireAuthModule } from '@angular/fire/compat/auth';
import{ AngularFirestoreModule } from '@angular/fire/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUH1Nt4U2LyCJCLmlu37ah8xby2pDhRBY",
  authDomain: "registr-6cd30.firebaseapp.com",
  projectId: "registr-6cd30",
  storageBucket: "registr-6cd30.appspot.com",
  messagingSenderId: "185834797744",
  appId: "1:185834797744:web:59d1203d9d722da6959975"
}
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp( environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

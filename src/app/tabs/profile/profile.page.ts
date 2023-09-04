import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user={} as User

  constructor(
    private firebasSvc: FirebaseService,
    private utilsSvc: UtilsService

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser();
  }

getUser(){
  return this.user = this.utilsSvc.getElementFromLocalStorage('user')
}


signOut() {
  this.utilsSvc.presentAlert({
    
      header: 'cerrar Sesion!',
      message: '¡Quieres cerrar secion?',
      mode:'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'si, cerrar',
          handler: () => {
            this.firebasSvc.signOut();
          }
        }
      ]
    }
)}
}

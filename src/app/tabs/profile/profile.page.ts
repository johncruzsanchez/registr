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

  user = {} as User; // Inicializa un objeto de tipo User

  constructor(
    private firebasSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.getUser(); // Cuando se inicia la página, obtiene el usuario
  }

  ionViewWillEnter() {
    this.getUser(); // Cuando la vista está a punto de entrar, obtiene el usuario
  }

  // Función para obtener el usuario actual
  getUser() {
    const userId = this.utilsSvc.getElementFromLocalStorage('user').uid;
  
    if (userId) {
      this.firebasSvc.getUserById(userId).subscribe(user => {
        if (user) {
          this.user = user; // Actualiza el objeto de usuario con los datos obtenidos
        }
      });
    }
  }

  // Función para cerrar sesión
  signOut() {
    this.utilsSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, cerrar',
          handler: () => {
            this.firebasSvc.signOut(); // Llama a la función de cerrar sesión del servicio Firebase
          }
        }
      ]
    });
  }
};
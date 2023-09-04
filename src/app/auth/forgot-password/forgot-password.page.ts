import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  email: string = ''; // Agrega la propiedad 'email' aquí

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  async resetPassword() {
    try {
      await this.firebaseSvc.sendPasswordResetEmail(this.email);
      this.utilsSvc.presentToast({
        message: 'Se ha enviado un correo de recuperación de contraseña.',
        duration: 3000,
        color: 'success',
      });
    } catch (error) {
      console.error('Error al enviar el correo de recuperación de contraseña:', error);
      this.utilsSvc.presentToast({
        message: 'Error al enviar el correo de recuperación de contraseña. Por favor, verifica la dirección de correo electrónico e intenta nuevamente.',
        duration: 3000,
        color: 'danger',
      });
    }
  }
}
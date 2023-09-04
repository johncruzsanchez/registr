import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custon-validators';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(duocuc\.cl|profesor\.duoc\.cl)$/)]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvs: UtilsService
  ) { }

  ngOnInit() {
    this.confirmPasswordValidator()
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ])

    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  async submit() {
    if (this.form.valid) {
      this.utilsSvs.presentLoading({ message: 'Registrando....' });
  
      try {
        // Registrar al usuario
        const userCredential = await this.firebaseSvc.singUP(this.form.value as User);
  
        // Verificar si el registro fue exitoso y el usuario está autenticado
        if (userCredential && userCredential.user && userCredential.user.uid) {
          // Crear el perfil del usuario
          await this.firebaseSvc.updateUser({ displayName: this.form.value.name });
          
          // Registro exitoso
          // ...
        } else {
          // Manejar el caso en que el usuario no está autenticado
          console.error("El usuario no está autenticado o falta información.");
        }
  
      } catch (error) {
        // Manejar el error y mostrar un mensaje al usuario
        console.error(error);
        this.utilsSvs.presentToast({
          message: 'Error en el registro: ' + error.message,
          duration: 2500,
          color: 'danger',
          icon: 'alert-circle-outline',
        });
      } finally {
        this.utilsSvs.dismissLoading(); // Asegúrate de ocultar el spinner de carga.
      }
    }
  }
}




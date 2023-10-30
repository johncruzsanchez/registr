import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  // Define un formulario con controles de email y contraseña
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, this.emailDomainValidator]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvs: UtilsService
  ) { }

  ngOnInit() {
  }

  // Función que se ejecuta cuando se envía el formulario
  submit() {
    if (this.form.valid) {
      // Muestra un mensaje de carga mientras se autentica al usuario
      this.utilsSvs.presentLoading({ message: 'Autenticando....' })

      // Intenta autenticar al usuario usando el servicio Firebase
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        console.log('Resultado de la autenticación:', res);
  
        if (res && res.user) {
          console.log('Usuario autenticado:', res.user);
  
          let user: User = {
            uid: res.user.uid,
            name: '', 
            email: res.user.email, 
            password: '', 
            role: 'Alumno', 
            telefono: '', 
            rut: '' 
          };
          // Guarda el usuario en el almacenamiento local
          this.utilsSvs.setElementInLocalstorage('user', user);

          // Redirige al usuario a la página principal
          this.utilsSvs.routerLink('/tabs/home')
          this.utilsSvs.dismissLoading();

          // Muestra un mensaje de bienvenida
          this.utilsSvs.presentToast({
            message: `Te damos la bienvenida ${user.name}`,
            duration: 2500,
            color: 'primary',
            icon: 'person-outline',
          })
          this.form.reset()
        } else {
          console.log('No se encontró el usuario');
          this.utilsSvs.dismissLoading();
          this.utilsSvs.presentToast({
            message: 'Error: Usuario no encontrado',
            duration: 1500,
            color: 'primary',
            icon: 'alert-circle-outline',
          })
          this.utilsSvs.dismissLoading();
        }
      }, error => {
        console.error('Error en la autenticación:', error);
        this.utilsSvs.dismissLoading();
        this.utilsSvs.presentToast({
          message: 'Error',
          duration: 1500,
          color: 'primary',
          icon: 'alert-circle-outline',
        })
      })
    }
  }
  
  // Validador personalizado de dominio de correo electrónico
  emailDomainValidator(control: FormControl) {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [_, domain] = email.split('@');
      if (domain !== 'duocuc.cl' && domain !== 'profesor.duocuc.cl') {
        return { invalidDomain: true };
      }
    }
    return null;
  }

  // Variable para almacenar el usuario autenticado
  user: any;

  // Función para obtener el usuario autenticado
  getUser() {
    const userId = this.utilsSvs.getElementFromLocalStorage('user').uid;
  
    if (userId) {
      this.firebaseSvc.getUserById(userId).subscribe(user => {
        if (user) {
          this.user = user;
        }
      });
    }  
  };
};
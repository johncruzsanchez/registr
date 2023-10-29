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

  submit() {
    if (this.form.valid) {
      this.utilsSvs.presentLoading({ message: 'Autenticando....' })
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        console.log('Resultado de la autenticación:', res);
  
        if (res && res.user) {
          console.log('Usuario autenticado:', res.user);
  
          let user: User = {
            uid: res.user.uid,
            name: '', // Esto debería ser proporcionado por el usuario, probablemente desde el formulario.
            email: res.user.email, // El email vendrá de la autenticación.
            password: '', // Esto no debería almacenarse en texto plano.
            role: 'Alumno', // Esto debería ser seleccionado por el usuario, probablemente desde el formulario.
            telefono: '', // Esto debería ser proporcionado por el usuario, probablemente desde el formulario.
            rut: '' // Esto debería ser proporcionado por el usuario, probablemente desde el formulario.
          };
          this.utilsSvs.setElementInLocalstorage('user', user);
          this.utilsSvs.routerLink('/tabs/home')
          this.utilsSvs.dismissLoading();

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
  user: any;
  getUser() {
    const userId = this.utilsSvs.getElementFromLocalStorage('user').uid;
  
    if (userId) {
      this.firebaseSvc.getUserById(userId).subscribe(user => {
        if (user) {
          this.user = user;
        }
      });
    }
    
  }
  
}
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  // Define un formulario con controles para el registro de usuarios
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    rut: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    role: new FormControl('alumno', [Validators.required]), // Cambiado a 'alumno'
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(duocuc\.cl|profesor\.duocuc\.cl)$/)]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvs: UtilsService
  ) { }

  ngOnInit() {
    // Asigna un validador personalizado para la confirmación de contraseña
    this.form.get('confirmPassword')?.setValidators(this.confirmPasswordValidator.bind(this));
  }

  // Validador personalizado para la confirmación de contraseña
  confirmPasswordValidator(control: FormControl) {
    const passwordControl = this.form.get('password');
    const confirmPasswordControl = this.form.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (confirmPasswordControl.value === passwordControl.value) {
        return null;
      } else {
        return { notMatch: true };
      }
    }

    return null;
  }

  // Función que se ejecuta cuando se envía el formulario de registro
  async submit() {
    if (this.form.valid) {
      this.utilsSvs.presentLoading({ message: 'Registrando....' });
  
      try {
        // Prepara los datos para el registro
        const signUpData: User = {
          email: this.form.get('email')!.value,
          password: this.form.get('password')!.value,
          name: this.form.get('name')!.value,
          role: this.form.get('role')!.value === 'Alumno' ? 'Alumno' : 'Profesor', 
          telefono: this.form.get('telefono')!.value,
          rut: this.form.get('rut')!.value
        };
  
        // Crea el usuario en la autenticación de Firebase
        const uid = await this.firebaseSvc.createUserInAuthentication(signUpData);

        if (uid) {
          // Prepara el perfil del usuario
          const userProfile = {
            email: signUpData.email,
            name: signUpData.name,
            role: signUpData.role,
            telefono: signUpData.telefono,
            rut: signUpData.rut 
          };

          const user: User = {
            uid: uid,
            ...userProfile,
            password: signUpData.password,
          };

          // Crea el perfil del usuario en Firestore
          await this.firebaseSvc.createUserProfileInFirestore(uid, userProfile);

          // Guarda el usuario en el almacenamiento local
          this.utilsSvs.setElementInLocalstorage('user', user);
          this.utilsSvs.routerLink('/tabs/home');
          this.utilsSvs.dismissLoading();

          // Muestra un mensaje de bienvenida
          this.utilsSvs.presentToast({
            message: `Te damos la bienvenida ${userProfile.name}`,
            duration: 2500,
            color: 'primary',
            icon: 'person-outline',
          });

          // Reinicia el formulario
          this.form.reset();
        } else {
          throw new Error('No se pudo crear el usuario en Authentication');
        }
      } catch (error) {
        console.error('Error en el registro:', error);
        this.utilsSvs.dismissLoading();
      }
    }
  }
};
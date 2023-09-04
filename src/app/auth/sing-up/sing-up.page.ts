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
    email: new FormControl('', [Validators.required, Validators.email]),
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

  sudmit() {
    if (this.form.valid) {

      this.utilsSvs.presentLoading({ message: 'Registrando....' })
      this.firebaseSvc.singUP(this.form.value as User).then(async res => {
        console.log(res);

        await this.firebaseSvc.updateUser({ displayName: this.form.value.name })

        let user: User = {
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
        }

        this.utilsSvs.setElementInLocalstorage( 'user', user); 
        this.utilsSvs.routerLink('/tabs/home')

        this.utilsSvs.dismissLoading();

        this.utilsSvs.presentToast({
          message: 'te damos la bienvenida `${user.name}` ' ,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline',
        })
      }, error => {
        this.utilsSvs.dismissLoading();
        this.utilsSvs.presentToast({
          message: 'error',
          duration: 1500,
          color: 'danger',
          icon: 'alert-circle-outline',
        })

      })
    
    }

    }
  }






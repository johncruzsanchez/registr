import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {


  form = new FormGroup ({
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', [Validators.required]),
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvs: UtilsService
  ) { }

  ngOnInit() {
  }


  sudmit(){
    if(this.form.valid){
      this.utilsSvs.presentLoading({ message: 'Autenticando....'})
      this.firebaseSvc.login(this.form.value as User).then(async res =>{
        console.log(res);
        
        let user: User ={
          uid: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          
        }

        this.utilsSvs.setElementInLocalstorage('user',user ); ///user
        this.utilsSvs.routerLink('/tabs/home')

        this.utilsSvs.dismissLoading();

        this.utilsSvs.presentToast({
          message:'te damos la bienvenida ${user.name} ',
          duration: 1500,
          color:'primary',
          icon:'person-outline',
        })
        this.form.reset()
      },error =>{
        this.utilsSvs.dismissLoading();
        this.utilsSvs.presentToast({
          message:'error',
          duration: 1500,
          color:'primary',
          icon:'alert-circle-outline',
        })
        this.utilsSvs.dismissLoading();
      }
      )


      
    }
  }
}

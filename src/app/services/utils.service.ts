import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ToastController, ToastOptions } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }
//loading
//present
async presentLoading (opts?: LoadingOptions){
  const loading = await this.loadingController.create(opts);
  await loading.present();

}
//dimiss
async dismissLoading(){
  return await this.loadingController.dismiss()
}


///local storage
//set
setElementInLocalstorage (key: string, element: any){
  return localStorage. setItem(key,JSON.stringify(element))
}

//get
getElementFromLocalStorage (key:string){
  return JSON.parse(localStorage.getItem(key))
}

async presentToast( opts: ToastOptions){
  const toast = await this.toastController.create(opts);
  toast.present();
}



//router
routerLink(url: string){
  return this.router.navigateByUrl(url);
}

//alerta
async presentAlert( opts: AlertOptions) {
  const alert = await this.alertController.create(opts);

  await alert.present();
}


async presentAlertConfirm() {
  const alert = await this.alertController.create();

  await alert.present();
}


}

import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from 'src/app/components/menu/menu.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public popoverController: PopoverController) { 

              }

  ngOnInit() {

  }

  async openMenu(ev: any) {
    console.log('abrir menu lateral');    
    const menu = await this.popoverController.create({
      component: MenuComponent,
      cssClass: 'my-custom-class',
      translucent: true,
      event: ev,
    });
    await menu.present();
  }








}

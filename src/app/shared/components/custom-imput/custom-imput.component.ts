import { Component, Input, OnInit } from '@angular/core';
import { FormControl  } from '@angular/forms'; 

@Component({
  selector: 'app-custom-imput',
  templateUrl: './custom-imput.component.html',
  styleUrls: ['./custom-imput.component.scss'],
})
export class CustomImputComponent  implements OnInit {

  @Input() control: FormControl;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string;
  @Input() autocomplete: string;

  isPassword:boolean;
  hide:boolean = true;
  constructor() { }

  ngOnInit() {
    if(this.type == 'password') this.isPassword = true;

  }
 showOrHidePassword(){
  this.hide = !this.hide;
  if (this.hide){
    this.type = 'Password'
  }else{
    this.type = 'text'
  }
 }
}

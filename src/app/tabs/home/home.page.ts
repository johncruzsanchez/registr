import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userRole: string = '';

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAuthState().subscribe(user => {
      if (user) {
        this.firebaseService.assignUserRole(user).then(role => {
          if (role) {
            this.userRole = role as string;
            console.log('Role asignado:', this.userRole);
          }
        });
      }
    });
  }
};
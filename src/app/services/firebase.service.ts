import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { UtilsService } from './utils.service';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) { }


  //======autenticar====
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password)
  }

  singUP(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(async (credential) => {
        const userCredential = credential.user;
        if (userCredential) {
          await this.updateUser({ displayName: user.name });
        }
        return credential;
      });
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user)
  }

  getAuthState(){
    return this.auth.authState
  }

async signOut(){
  await this.auth.signOut();
  this.utilsSvc.routerLink('/auth');
  localStorage.removeItem('user');
}

sendPasswordResetEmail(email: string) {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email); // Utiliza sendPasswordResetEmail para enviar el correo de recuperación
}



}

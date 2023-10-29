import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getAuth, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  getUserName(uid: string) {
    throw new Error('Method not implemented.');
  }
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) {
    this.usersCollection = this.db.collection<User>('usuarios');
    this.users = this.usersCollection.valueChanges({ idField: 'uid' });
  }

  async assignUserRole(user: FirebaseUser) {
    try {
      const userClaims = await user.getIdTokenResult();
      const role = userClaims.claims['role'];

      return role || null;
    } catch (error) {
      console.error('Error al asignar el rol:', error);
      return null;
    }
  }

  async login(user: User) {
    try {
      const res = await this.auth.signInWithEmailAndPassword(user.email, user.password);
  
      if (res && res.user) {
        await this.assignUserRole(res.user);
        return res;
      } else {
        throw new Error('No se encontró el usuario');
      }
    } catch (error) {
      throw error;
    }
  }
  
  async signUp(user: User) {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(user.email, user.password);
  
      const userCredential = credential.user;
      if (userCredential) {
        await this.updateUser({
          displayName: user.name,
          role: user.role 
        });
  
        const userData: User = {
          uid: userCredential.uid,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          telefono: user.telefono || '',
          rut: user.rut,
        };
  
        await this.createUser(userData);
  
        return credential; 
      }
    } catch (error) {
      throw error;
    }
  
    throw new Error('Algo salió mal durante el registro'); 
  }
  updateUser(user: any) {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      return updateProfile(currentUser, user);
    } else {
      return Promise.reject(new Error('Usuario no autenticado'));
    }
  }

  getAuthState(){
    return this.auth.authState;
  }

  async signOut(){
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth');
    localStorage.removeItem('user');
  }

  sendPasswordResetEmail(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  createUser(user: User): Promise<void> {
    return this.usersCollection.doc(user.uid).set(user);
  }

  getUserById(id: string): Observable<User> {
    return this.usersCollection.doc<User>(id).valueChanges();
  }
  async createUserProfile(user: User) {
    try {
      const userRef = this.db.collection('users').doc(user.uid);
      await userRef.set(user);
    } catch (error) {
      throw error;
    }
  }
  async createUserInAuthentication(user: User): Promise<string | null> {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(user.email, user.password);
      return credential.user?.uid || null;
    } catch (error) {
      console.error('Error al crear el usuario en Authentication:', error);
      return null;
    }
  }
  
  async createUserProfileInFirestore(uid: string, userProfile: Partial<User>): Promise<void> {
    try {
      const userRef = this.db.collection('usuarios').doc(uid);
      await userRef.set(userProfile);
    } catch (error) {
      console.error('Error al crear el perfil en Firestore:', error);
      throw error;
    }
  }
}
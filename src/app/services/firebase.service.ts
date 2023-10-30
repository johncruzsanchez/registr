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
    private utilsSvc: UtilsService,
    private firestore: AngularFirestore
  ) {
    // Configura la colección de usuarios y observa los cambios
    this.usersCollection = this.db.collection<User>('usuarios');
    this.users = this.usersCollection.valueChanges({ idField: 'uid' });
  }

  // Asigna un rol a un usuario
  async assignUserRole(user: FirebaseUser) {
    try {
      const userDoc$ = this.db.collection('usuarios').doc<User>(user.uid).get();
      userDoc$.subscribe((userDoc) => {
        const userData = userDoc.data();
        const role = userData?.role;
        console.log('Role asignado:', role);
        return role || null;
      });
    } catch (error) {
      console.error('Error al asignar el rol:', error);
      return null;
    }
  }

  // Obtiene el rol de un usuario
  async getUserRole(uid: string): Promise<string | null> {
    try {
      const userDoc = await this.db.collection('usuarios').doc(uid).get().toPromise();
      const userData: any = userDoc.data(); // Especificamos 'any' como tipo

      if (userData && userData.role) {
        return userData.role;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return null;
    }
  }

  // Inicia sesión
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

  // Registra un nuevo usuario
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

  // Actualiza el perfil del usuario
  updateUser(user: any) {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      return updateProfile(currentUser, user);
    } else {
      return Promise.reject(new Error('Usuario no autenticado'));
    }
  }

  // Obtiene el estado de autenticación
  getAuthState(){
    return this.auth.authState;
  }

  // Cierra sesión
  async signOut(){
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth');
    localStorage.removeItem('user');
  }

  // Envía un correo electrónico de restablecimiento de contraseña
  sendPasswordResetEmail(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }

  // Obtiene la lista de usuarios
  getUsers(): Observable<User[]> {
    return this.users;
  }

  // Crea un nuevo usuario
  createUser(user: User): Promise<void> {
    return this.usersCollection.doc(user.uid).set(user);
  }

  // Obtiene un usuario por su ID
  getUserById(id: string): Observable<User> {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  // Crea un perfil de usuario
  async createUserProfile(user: User) {
    try {
      const userRef = this.db.collection('users').doc(user.uid);
      await userRef.set(user);
    } catch (error) {
      throw error;
    }
  }

  // Crea un usuario en la autenticación
  async createUserInAuthentication(user: User): Promise<string | null> {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(user.email, user.password);
      return credential.user?.uid || null;
    } catch (error) {
      console.error('Error al crear el usuario en Authentication:', error);
      return null;
    }
  }

  // Crea un perfil de usuario en Firestore
  async createUserProfileInFirestore(uid: string, userProfile: Partial<User>): Promise<void> {
    try {
      const userRef = this.db.collection('usuarios').doc(uid);
      await userRef.set(userProfile);
    } catch (error) {
      console.error('Error al crear el perfil en Firestore:', error);
      throw error;
    }
  }

  // Agrega una clase a la base de datos
  agregarClase(nombre: string, horaInicio: string, horaTermino: string,fechaClase:string) {
    return this.firestore.collection('clases').add({
      nombre: nombre,
      horaInicio: horaInicio,
      horaTermino: horaTermino,
      fechaClase:fechaClase
    });
  }

  // Obtiene la lista de clases
  getClases(): Observable<any[]> {
    console.log('Obteniendo clases...');
    return this.firestore.collection('clases').valueChanges();
  }
};
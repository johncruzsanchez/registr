import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profesor } from '../models/profesor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private profesoresCollection: AngularFirestoreCollection<Profesor>;
  profesores: Observable<Profesor[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.profesoresCollection = afs.collection<Profesor>('profesores');
    this.profesores = this.profesoresCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Profesor;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getProfesores(): Observable<Profesor[]> {
    return this.profesores;
  }

  getProfesorById(id: string): Observable<Profesor | undefined> {
    return this.profesoresCollection.doc<Profesor>(id).valueChanges();
  }

  addProfesor(profesor: Profesor): Promise<DocumentReference<Profesor>> {
    return this.profesoresCollection.add(profesor);
  }

  updateProfesor(id: string, profesor: Profesor): Promise<void> {
    return this.profesoresCollection.doc<Profesor>(id).update(profesor);
  }

  deleteProfesor(id: string): Promise<void> {
    return this.profesoresCollection.doc<Profesor>(id).delete();
  }
}
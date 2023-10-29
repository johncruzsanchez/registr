import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alumno } from '../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private alumnosCollection: AngularFirestoreCollection<Alumno>;
  alumnos: Observable<Alumno[]>;

  constructor(private readonly afs: AngularFirestore) {
    this.alumnosCollection = afs.collection<Alumno>('alumnos');
    this.alumnos = this.alumnosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Alumno;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnos;
  }

  getAlumnoById(id: string): Observable<Alumno | undefined> {
    return this.alumnosCollection.doc<Alumno>(id).valueChanges();
  }

  addAlumno(alumno: Alumno): Promise<DocumentReference<Alumno>> {
    return this.alumnosCollection.add(alumno);
  }

  updateAlumno(id: string, alumno: Alumno): Promise<void> {
    return this.alumnosCollection.doc<Alumno>(id).update(alumno);
  }

  deleteAlumno(id: string): Promise<void> {
    return this.alumnosCollection.doc<Alumno>(id).delete();
  }
}
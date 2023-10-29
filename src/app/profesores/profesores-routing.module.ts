import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoDetailsComponent } from '../alumnos/alumno-details/alumno-details.component';
import { AlumnosListComponent } from '../alumnos/alumnos-list/alumnos-list.component';
import { ProfesoresListComponent } from './profesores-list/profesores-list.component';
import { ProfesorDetailsComponent } from './profesor-details/profesor-details.component';

const routes: Routes = [
  { path: 'alumnos', component: AlumnosListComponent },
  { path: 'alumnos/:id', component: AlumnoDetailsComponent },
  { path: 'profesores', component: ProfesoresListComponent },
  { path: 'profesores/:id', component: ProfesorDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesoresRoutingModule { }

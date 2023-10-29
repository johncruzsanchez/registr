import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-alumno-details',
  templateUrl: './alumno-details.component.html',
  styleUrls: ['./alumno-details.component.scss'],
})
export class AlumnoDetailsComponent implements OnInit {
  alumno: Alumno;

  constructor(private alumnosService: AlumnosService) {}

  ngOnInit() {
    // Obtener el ID del alumno desde la URL o de donde corresponda
    const alumnoId = 'ID_DEL_ALUMNO';

    // Llamar al servicio para obtener la información del alumno
    this.alumnosService.getAlumnoById(alumnoId).subscribe(alumno => {
      this.alumno = alumno;
    });
  }
}
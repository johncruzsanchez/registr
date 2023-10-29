import { Component, OnInit } from '@angular/core';
import { Profesor } from 'src/app/models/profesor.model';
import { ProfesoresService } from 'src/app/services/profesores.service';

@Component({
  selector: 'app-profesor-details',
  templateUrl: './profesor-details.component.html',
  styleUrls: ['./profesor-details.component.scss'],
})
export class ProfesorDetailsComponent implements OnInit {
  profesor: Profesor;

  constructor(private profesoresService: ProfesoresService) {}

  ngOnInit() {
    // Obtener el ID del profesor desde la URL o de donde corresponda
    const profesorId = 'ID_DEL_PROFESOR';

    // Llamar al servicio para obtener la información del profesor
    this.profesoresService.getProfesorById(profesorId).subscribe(profesor => {
      this.profesor = profesor;
    });
  }
}
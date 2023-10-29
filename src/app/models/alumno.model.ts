export class Alumno {
    id: number;
    nombre: string;
    edad: number;
    correo: string;
  
    constructor(id: number, nombre: string, edad: number, correo: string) {
      this.id = id;
      this.nombre = nombre;
      this.edad = edad;
      this.correo = correo;
    }
  }
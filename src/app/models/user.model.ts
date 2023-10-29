export interface User {
  email: string;
  password: string;
  uid?: string;
  name: string;
  role: 'Alumno' | 'Profesor';
  telefono: string;
  rut: string; 
}
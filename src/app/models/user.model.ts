export interface User {
  email: string;
  password: string;
  uid?: string;
  name: string;
  role: 'alumno' | 'profesor';
  telefono: string;
  rut: string; 
}
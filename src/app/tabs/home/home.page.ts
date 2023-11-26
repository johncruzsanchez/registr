import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userRole: string = ''; // Variable para almacenar el rol del usuario
  form: FormGroup; // Formulario para agregar clases
  clases: any[] = []; // Variable para almacenar las clases
  qrCodeImageUrl: string;
  qrCodeLink: string; // propiedad para almacenar el enlace QR
  
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    //el formulario con validadores
    this.form = this.fb.group({
      nombreClase: ['', [Validators.required]],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      horaTermino: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      fechaClase: ['', [Validators.required,Validators.pattern(/^(Lunes|Martes|Miercoles|Jueves|Viernes|Sabado|Domingo)$/)]],
    });
  }

  ngOnInit() {
    // Obtener el rol del usuario cuando se inicia la página
    this.firebaseService.getAuthState().subscribe(user => {
      if (user) {
        this.firebaseService.assignUserRole(user).then(role => {
          this.userRole = role || '';
          this.loadClases(); // Carga las clases después de obtener el rol
        });
      }
    });
  }
  
  // Función para agregar una nueva clase
  agregarClase() {
    if (this.form.valid) {
      const nombreClase = this.form.get('nombreClase').value;
      const horaInicio = this.form.get('horaInicio').value;
      const horaTermino = this.form.get('horaTermino').value;
      const fechaClase = this.form.get('fechaClase').value;

      this.firebaseService.agregarClase(nombreClase, horaInicio, horaTermino, fechaClase)
        .then(() => {
          console.log('Clase agregada con éxito');
        })
        .catch(error => {
          console.error('Error al agregar la clase:', error);
        });
    } else {
      console.error('Formulario no válido. Por favor, verifica los campos.');
    }
  }
  
  // Función para cargar las clases desde Firebase
  loadClases() {
    this.firebaseService.getClases().subscribe({
      next: (data) => {
        this.clases = data;
        console.log('Clases cargadas:', this.clases);
      },
      error: (error) => {
        console.error('Error al cargar las clases:', error);
      }
    });
  }

   // función para generar un código QR
   async generateQRCode() {
    const qrData = 'http://localhost:8100'; // Reemplaza con tu enlace
    try {
      const canvas = await QRCode.toCanvas(qrData, { width: 200 });
      const imageUrl = canvas.toDataURL();
      this.qrCodeImageUrl = imageUrl;
      this.qrCodeLink = qrData; // Actualiza la propiedad qrCodeLink
      console.log('URL del código QR:', imageUrl);
    } catch (error) {
      console.error('Error al generar el código QR:', error);
    }
  }
  
  // Nueva función para generar el código QR en respuesta a un evento
  generarCodigoQR() {
    this.generateQRCode();
  }

};
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
})
export class Home2Page implements OnInit {
  userRole: string = ''; // Variable para almacenar el rol del usuario
  form: FormGroup; // Formulario para agregar clases
  clases: any[] = []; // Variable para almacenar las clases

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private qrScanner: QRScanner, // Agrega el servicio del escáner QR
    private androidPermissions: AndroidPermissions
  ) {
    // Configura el formulario con validadores
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
  // Función para escanear un código QR
  scanQR() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // La cámara está autorizada, procede con el escaneo
          this.qrScanner.show();
          document.getElementsByTagName('body')[0].style.display = 'none'; // Oculta el contenido detrás de la cámara

          const scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Código QR escaneado:', text);

            // Lógica adicional según tus necesidades

            this.qrScanner.hide();
            document.getElementsByTagName('body')[0].style.display = 'block'; // Restaura el contenido oculto
            scanSub.unsubscribe(); // Detiene la suscripción al escáner después de un escaneo exitoso
          });

        } else if (status.denied) {
          // Permiso denegado por el usuario
          // Puedes mostrar un mensaje al usuario para pedirle que habilite el permiso desde la configuración
        } else {
          // Otra condición (status.restricted, status.notDetermined) 
          // Puedes manejarla según tus necesidades
        }
      })
      .catch((e: any) => console.log('Error al preparar el escáner QR:', e));
  }
  // Verificación y solicitud de permisos de cámara
  checkCameraPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(
        result => console.log('Tiene permisos de cámara?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
  }

};
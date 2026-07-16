import { Component, OnInit } from '@angular/core'; // 1. Agregamos OnInit
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms'; 
import { CarritoService } from '../../services/carrito.service'; 

@Component({
  selector: 'app-checkout-datos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout-datos.html',
  styleUrls: ['./checkout-datos.css']
})
export class CheckoutDatos implements OnInit { 
  nombre: string = '';
  apellido: string = '';
  telefono: string = '';
  email: string = '';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    const datosGuardados = this.carritoService.getDatos();
    
    this.nombre = datosGuardados.customerName || '';
this.apellido = datosGuardados.customerLastName || '';
this.telefono = datosGuardados.customerPhone || '';
this.email = datosGuardados.customerEmail || '';
  }

 procesarDatos(form: NgForm) {
    if (form.invalid) {
      console.warn('⚠️ [PASO 1] Formulario de datos incompleto o inválido');
      return; 
    }

    // 🔥 FIJACIÓN EN INGLÉS: Guardamos con las claves exactas que exige NestJS
    const paqueteDatos = {
      customerName: this.nombre,
      customerLastName: this.apellido,
      customerPhone: this.telefono,
      customerEmail: this.email
    };

    this.carritoService.setDatos(paqueteDatos);

    console.log('✅ [PASO 1] Datos del cliente inyectados al CarritoService:', this.carritoService.getDatos());
    
    // Avanzamos de forma controlada al siguiente paso
    this.router.navigate(['/checkout-entrega']);
  }
}
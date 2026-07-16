import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service'; 

@Component({
  selector: 'app-checkout-entrega',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout-entrega.html',
  styleUrls: ['./checkout-entrega.css']
})
export class CheckoutEntrega implements OnInit { 
  // Iniciamos con el Enum en inglés directo
  modoEntrega: string = 'take_away'; 
  direccion: string = '';
  observaciones: string = '';

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    const datosGuardados = this.carritoService.getDatos();
    console.log('📦 [PASO 2 - INIT] Datos de entrada:', datosGuardados);
    
    this.modoEntrega = datosGuardados.deliveryMode || 'take_away';
    this.direccion = datosGuardados.deliveryAddress || '';
    this.observaciones = datosGuardados.notes || '';
  }

  guardarYContinuar() {
    if (this.modoEntrega !== 'take_away' && !this.direccion.trim()) {
      return; 
    }
    const datosActuales = this.carritoService.getDatos();

    const paqueteEntrega = {
      ...datosActuales, 
      deliveryMode: this.modoEntrega,       
      deliveryAddress: this.modoEntrega === 'take_away' ? '' : this.direccion, 
      notes: this.observaciones       
    };

    this.carritoService.setDatos(paqueteEntrega);
    this.router.navigate(['/checkout-resumen']);
  }
}
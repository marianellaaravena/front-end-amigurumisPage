import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class Carrito implements OnInit {
  cartItems: any[] = [];
  checkoutForm!: FormGroup;

  constructor(
    private carritoService: CarritoService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.items$.subscribe(items => this.cartItems = items);

    // Inicializamos el formulario con las nuevas validaciones estrictas del backend
    this.checkoutForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerLastName: ['', [Validators.required]],
      customerEmail: ['', [Validators.email]],
      customerPhone: ['', [Validators.required]],
      deliveryMode: ['take_away', [Validators.required]], // Por defecto 'Retiro en local'
      deliveryAddress: [''],
      notes: ['']
    });

    // Validar dinámicamente si la dirección es obligatoria
    this.checkoutForm.get('deliveryMode')?.valueChanges.subscribe(mode => {
      const addressControl = this.checkoutForm.get('deliveryAddress');
      if (mode === 'delivery') {
        addressControl?.setValidators([Validators.required]);
      } else {
        addressControl?.clearValidators();
      }
      addressControl?.updateValueAndValidity();
    });
  }

  get totalPedido() {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  sumarCantidad(item: any) {
    if (item.quantity < item.stock) {
      this.carritoService.updateQuantity(item.id, 1); // Corregido: Usa el servicio igual que el restar
    }
  }

  restarCantidad(item: any) { 
    this.carritoService.updateQuantity(item.id, -1); 
  }

  eliminarItem(id: number) { 
    this.carritoService.removeItem(id); 
  }

  vaciarCarrito() { 
    this.carritoService.clearCart(); 
  }

  /**
   * PROCESAR LA COMPRA HACIA EL BACKEND 🧶
   * Mapea los datos del formulario y del carrito al CreateOrderDto unificado.
   */
  enviarPedido() {
    if (this.checkoutForm.invalid || this.cartItems.length === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    // Estructuramos el DTO de envío mapeando los items como 'productId' y 'quantity'
    const datosPedido = {
      ...this.checkoutForm.value,
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        notes: item.notes || ''
      }))
    };

    // Petición POST al controlador unificado de NestJS
    this.http.post<any>('http://localhost:3000/orders', datosPedido).subscribe({
      next: (response) => {
        alert(`¡Pedido creado con éxito! Tu código de seguimiento es #${response.orderNumber}`);
        this.vaciarCarrito();
        // Redirige al cliente a tu pantalla del Stepper animado pasando el código
        this.router.navigate(['/track', response.orderNumber]);
      },
      error: (err) => {
        alert('Error al procesar la compra: ' + err.error.message);
      }
    });
  }
}
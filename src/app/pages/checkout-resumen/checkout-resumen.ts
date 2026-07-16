import { Component, OnInit, inject } from '@angular/core'; // 💡 Sumamos 'inject'
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { CarritoService } from '../../services/carrito.service';
import { OrderService } from '../../services/order.service'; // 💡 Importamos el servicio centralizado

@Component({
  selector: 'app-checkout-resumen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-resumen.html',
  styleUrls: ['./checkout-resumen.css']
})
export class CheckoutResumen implements OnInit {
  // 💡 Inyecciones de dependencias modernas combinadas
  private carritoService = inject(CarritoService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  datosUsuario: any = {};
  carritoItems: any[] = [];
  totalPedido: number = 0;
  loading: boolean = false; 

  // Constructor vacío e impecable 🧶
  constructor() {}

  ngOnInit() {
    this.datosUsuario = this.carritoService.getDatos();
    this.carritoItems = this.carritoService.getItems();
    this.totalPedido = this.carritoService.getTotal();
    
    console.log('📋 [PASO 3 - RESUMEN] Datos cargados en memoria:', {
      usuario: this.datosUsuario,
      items: this.carritoItems,
      total: this.totalPedido
    });
  }

  /**
   * TRADUCTOR PARA MOSTRAR TEXTO LINDO EN EL HTML DEL RESUMEN
   */
  getDeliveryModeText(mode: string): string {
    if (mode === 'delivery') return 'Envío a Domicilio 📦';
    if (mode === 'dine_in') return 'Punto de Encuentro 📍';
    return 'Retiro en Local 🏪';
  }

  /**
   * PROCESAR Y GUARDAR EL PEDIDO EN LA BASE DE DATOS 🎉
   */
  confirmarYGuardarPedido() {
    if (this.loading) return;
    this.loading = true;

    const d = this.datosUsuario;
    const emailValidado = (d.customerEmail && d.customerEmail.trim() !== '') ? d.customerEmail : undefined;

    // Estructuramos el objeto EXACTO que pide el CreateOrderDto del backend unificado
    const pedidoParaBackend = {
      customerName: d.customerName,
      customerLastName: d.customerLastName,
      customerPhone: d.customerPhone,
      customerEmail: emailValidado,
      deliveryAddress: d.deliveryAddress || undefined,
      deliveryMode: d.deliveryMode || 'take_away', 
      notes: d.notes || '',
      items: this.carritoItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        notes: item.notes || ''
      }))
    };

    console.log('🚀 [PASO 3] Despachando JSON definitivo hacia NestJS a través de OrderService:', pedidoParaBackend);

    // 🚀 Delegamos la responsabilidad de la petición HTTP al servicio centralizado
    this.orderService.createOrder(pedidoParaBackend).subscribe({
      next: (res: any) => {
        console.log('✅ [PASO 3] Pedido impactado en MySQL con éxito. Respuesta:', res);
        
        this.router.navigate(['/pedido-confirmado'], { 
          state: { orderNumber: res.orderNumber } 
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ [PASO 3] El backend rechazó la orden:', err);
        alert('Hubo un problema al procesar tu compra: ' + (err.error?.message || err.message));
      }
    });
  }
}
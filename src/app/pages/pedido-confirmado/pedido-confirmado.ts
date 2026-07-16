import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core'; // 💡 Sumamos 'inject'
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; 
import { CarritoService } from '../../services/carrito.service';
import { OrderService } from '../../services/order.service'; // 💡 Importamos tu nuevo servicio
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedido-confirmado.html',
  styleUrls: ['./pedido-confirmado.css']
  })
export class PedidoConfirmado implements OnInit {
  // 💡 Inyecciones de dependencias con sintaxis moderna e inmaculada 🧶
  private carritoService = inject(CarritoService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  nroOrden: string = '';
  total: number = 0;
  modo: string = '';
  qrData: SafeUrl = '';

  constructor() { }

  ngOnInit() {
    this.total = this.carritoService.getTotal();
    this.modo = this.carritoService.getDatos().deliveryMode || 'take_away';

    const navegacion = this.router.getCurrentNavigation();
    const estado = navegacion?.extras.state || window.history.state;

    if (estado && estado.orderNumber) {
      this.nroOrden = estado.orderNumber;
      console.log('🎉 [FINAL] Número de orden recibido en pantalla final:', this.nroOrden);
      
      this.obtenerQR(this.nroOrden);
    } else {
      console.warn('⚠️ No se detectó orderNumber en el estado de la ruta.');
      this.nroOrden = 'ERROR'; 
    }

    setTimeout(() => {
      this.carritoService.clearCart();
      this.cdr.detectChanges();
    }, 50);
  }

  obtenerQR(orderNumber: string) {
    console.log(`🔍 Solicitando QR al backend para la orden: ${orderNumber}`);
    
    // 🚀 Delegamos la obtención del QR al OrderService
    this.orderService.getQrCode(orderNumber).subscribe({
      next: (res: any) => {
        console.log('✅ QR recibido con éxito:', res);
        this.qrData = this.sanitizer.bypassSecurityTrustUrl(res.qrCode);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al obtener el código QR del servidor:', err);
      }    
    });
  }

  enviarWhatsApp() {
    // 🚀 Delegamos el post de notificación al OrderService
    this.orderService.notifyWhatsApp(this.nroOrden).subscribe({
      next: () => console.log('Notificación de WhatsApp procesada por el servidor web'),
      error: (err) => console.error('Error en notificación interna:', err)
    });

    const telefonoNegocio = '5493888539967';
    const mensaje = `¡Hola Tejiendo Sueños! 🧶 Realicé un pedido en la web. Código de orden: #${this.nroOrden}.`;
    window.open(`https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }
  getModoTexto(mode: string): string {
    if (mode === 'delivery') return 'A domicilio 📦';
    if (mode === 'dine_in') return 'Punto de encuentro 📍';
    return 'Retiro en local 🏪';
  }
}
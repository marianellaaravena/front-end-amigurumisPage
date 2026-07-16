import { Component, ChangeDetectorRef, inject } from '@angular/core'; // 💡 Sumamos 'inject'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service'; // 💡 Importamos el servicio centralizado

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguimiento.html',
  styleUrls: ['./seguimiento.css']
})
export class Seguimiento {
  // 💡 Inyección de dependencias moderna (estilo Admin)
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  idPedido: string = '';
  pedidoSeleccionado: any = null;
  loading: boolean = false;
  errorMensaje: string = '';

  constructor() { }

  buscarPedido() {
    if (!this.idPedido.trim()) {
      this.errorMensaje = 'Por favor, ingresa un número de pedido válido.';
      return;
    }

    this.loading = true;
    this.errorMensaje = '';
    this.pedidoSeleccionado = null;

    // 🚀 Delegamos la petición HTTP a nuestro OrderService
    this.orderService.trackOrder(this.idPedido).subscribe({
      next: (res: any) => {
        this.pedidoSeleccionado = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener el pedido:', err);
        this.errorMensaje = 'No se encontró ningún pedido con ese código.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusText(status: string): string {
    const traducciones: { [key: string]: string } = {
      'pending': 'Pendiente de aprobación',
      'confirmed': 'Pedido Confirmado',
      'preparing': 'Tejiendo tu amigurumi 🧶',
      'ready': '¡Listo para entregar! 🎁',
      'out_for_delivery': 'En reparto hacia tu casa 🚚',
      'completed': '¡Pedido Entregado! 🎉',
      'cancelled': 'Pedido Cancelado ❌',
      'rejected': 'Pedido Reichazado ⚠️'
    };
    return traducciones[status] || status;
  }

  getStatusStep(status: string): number {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'preparing': return 3;
      case 'ready': return 4;
      case 'out_for_delivery': return 5;
      case 'completed': return 6;
      default: return 1;
    }
  }

  getStatusDate(statusName: string): string {
    if (!this.pedidoSeleccionado || !this.pedidoSeleccionado.statusHistory) {
      return '-';
    }

    const historyEntry = this.pedidoSeleccionado.statusHistory.find(
      (h: any) => h.status === statusName
    );

    if (!historyEntry || !historyEntry.createdAt) {
      return '-';
    }

    const fecha = new Date(historyEntry.createdAt);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes} ${horas}:${minutos}`;
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
private apiUrl = 'https://back-end-amigurumipage-1.onrender.com/orders';
  // 1. Guarda el pedido en MySQL (Se usa en CheckoutResumen)
  createOrder(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  // 2. Trae el QR en Base64 (Se usa en PedidoConfirmado)
  getQrCode(orderNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderNumber}/qr-base64`);
  }

  // 3. Busca el historial de los 6 estados (Se usa en Seguimiento)
  trackOrder(orderNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/track/${orderNumber}`); // 💡 Le sumamos el /track/ que pedía tu backend
  }

  notifyWhatsApp(orderNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${orderNumber}/notify-whatsapp`, {});
  }
}

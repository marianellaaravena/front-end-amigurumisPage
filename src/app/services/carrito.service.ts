import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  // Estructura actualizada según el CreateOrderDto del nuevo Backend 🧶
  public datosCheckout = { 
    customerName: '', 
    customerLastName: '', 
    customerPhone: '', 
    customerEmail: '', 
    deliveryMode: 'retiro_local', 
    deliveryAddress: '',
    notes: ''
  };

  private apiUrl: 'https://back-end-amigurumipage-1.onrender.com/orders';

  constructor(private http: HttpClient) { }

  addToCart(product: any) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
        this.itemsSubject.next([...currentItems]);
      } else {
        console.warn(`No se puede agregar más: el stock máximo es ${product.stock}`);
      }
    } else {
      if (product.stock > 0) {
        this.itemsSubject.next([...currentItems, { ...product, quantity: 1 }]);
      }
    }
  }

  updateQuantity(id: number, change: number) {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(item => item.id === id);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) this.removeItem(id);
      else this.itemsSubject.next([...currentItems]);
    }
  }

  removeItem(id: number) {
    this.itemsSubject.next(this.itemsSubject.value.filter(item => item.id !== id));
  }

  getItems() {
    return this.itemsSubject.value; 
  }

  getTotal() {
    return this.itemsSubject.value.reduce((acc, item) => {
      const precio = Number(item.price) || 0; 
      return acc + (precio * item.quantity);
    }, 0);
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  // --- MÉTODOS DEL CHECKOUT ADAPTADOS ---
  setDatos(nuevosDatos: any) {
    this.datosCheckout = { ...this.datosCheckout, ...nuevosDatos };
  }

  getDatos() {
    return this.datosCheckout;
  }

  /**
   * Envía el pedido mapeado de forma segura a NestJS
   */
  crearPedido(formularioValues: any): Observable<any> {
    const pedidoDto = {
      ...formularioValues,
      items: this.itemsSubject.value.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        notes: item.notes || '' // Por si el cliente deja una aclaración del amigurumi
      }))
    };

    return this.http.post<any>(this.apiUrl, pedidoDto);
  }
}

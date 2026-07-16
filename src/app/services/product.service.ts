import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
private apiUrl = 'https://back-end-amigurumipage-1.onrender.com/products';
  // Trae los amigurumis disponibles (los que no están deshabilitados)
  getAvailableProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available`);
  }
}

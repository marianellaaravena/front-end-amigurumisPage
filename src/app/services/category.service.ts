import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
private apiUrl = 'https://back-end-amigurumipage-1.onrender.com/categories';
  // Trae solo las categorías que están activas para tus botones del catálogo
  getActiveCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active`);
  }
}

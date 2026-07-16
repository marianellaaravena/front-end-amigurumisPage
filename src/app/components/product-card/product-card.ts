import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../services/carrito.service'; 

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product: any;
  showFeedback = false; 

  constructor(private carritoService: CarritoService) {}

  addToCart() {
    this.carritoService.addToCart(this.product);
    
    // Activa la burbuja
    this.showFeedback = true;
    setTimeout(() => this.showFeedback = false, 2000); 
  }
}


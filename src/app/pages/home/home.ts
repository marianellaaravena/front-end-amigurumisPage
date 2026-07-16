import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductCard } from '../../components/product-card/product-card';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  currentIndex = 0;

  carouselImages: any[] = [];
  recommendedProducts: any[] = [];
  categories = [
    { name: 'ANIMALES', icon: '🦁', color: '#d1edf2' },
    { name: 'MUÑECAS', icon: '👧', color: '#ffe4cc' },
    { name: 'FANTASÍA', icon: '🐉', color: '#d1f2e5' },
    { name: 'LLAVEROS', icon: '🌈', color: '#fff0cc' },
    { name: 'BEBÉS', icon: '🪇', color: '#f2d1e5' }
  ];

constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {

  this.http.get<any[]>('http://localhost:3000/products/category/4')
    .subscribe({
      next: (productos) => {
        this.carouselImages = productos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error carrusel:', err);
      }
    });

  this.http.get<any[]>('http://localhost:3000/products/category/10')
    .subscribe({
      next: (productos) => {
        this.recommendedProducts = productos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error recomendados:', err);
      }
    });

}

  nextSlide(): void {
    if (this.carouselImages.length > 0) {
      this.currentIndex =
        (this.currentIndex + 1) % this.carouselImages.length;
    }
  }

  prevSlide(): void {
    if (this.carouselImages.length > 0) {
      this.currentIndex =
        (this.currentIndex - 1 + this.carouselImages.length) %
        this.carouselImages.length;
    }
  }

  logError(event: any): void {
    console.log('Error cargando imagen:', event);

    if (this.carouselImages.length > 0) {
      console.log(
        'URL:',
        'http://localhost:3000' + this.carouselImages[this.currentIndex].imageUrl
      );
    }
  }

}
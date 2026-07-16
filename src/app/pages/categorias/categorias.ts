import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core'; // 💡 Sumamos 'inject'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ProductCard } from '../../components/product-card/product-card';
import { CategoryService } from '../../services/category.service'; // 💡 Importamos tu nuevo servicio
import { ProductService } from '../../services/product.service';   // 💡 Importamos tu nuevo servicio

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class Categorias implements OnInit {

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedCategory: number = 0; 
  categorias: any[] = [];

  // Diccionario de diseño permanente para los amigurumis
  estilosCategorias: { [key: string]: { icon: string, color: string } } = {
    'FANTASÍA': { icon: '🐉', color: '#d1f2e5' },
    'ANIMALES Y MASCOTAS': { icon: '🦁', color: '#d1edf2' },
    'LLAVEROS': { icon: '🌈', color: '#fff0cc' },
    'NOMBRES TEJIDOS': { icon: '🧶', color: '#e6ccff' },
    'TEMPORADA INVIERNO': { icon: '❄️', color: '#d1f0f2' },
    'FLORES Y RAMOS': { icon: '💐', color: '#ffe4cc' },
    'HOGAR': { icon: '🏡', color: '#e2f2d1' },
    'BEBÉS': { icon: '🪇', color: '#f2d1e5' },
    'OFERTAS': { icon: '🔥', color: '#ffcccc' }
  };

  constructor() {}

  ngOnInit(): void {
    this.categoryService.getActiveCategories().subscribe({
      next: (data) => {
        this.categorias = data.map(cat => {
          const nombreNormalizado = cat.name.toUpperCase().trim();
          const diseño = this.estilosCategorias[nombreNormalizado] || { icon: '🧸', color: '#f0f0f0' };
          return {
            id: cat.id,
            name: cat.name,
            icon: diseño.icon,
            color: diseño.color
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });

    this.productService.getAvailableProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  seleccionarCategoria(idCategoria: number): void {
    this.selectedCategory = (this.selectedCategory === idCategoria) ? 0 : idCategoria;
    this.searchTerm = ''; 
    this.applyFilters();
  }

  buscarPorTexto(): void {
    this.selectedCategory = 0; 
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(prod => {
      if (this.searchTerm.trim() !== '') {
        const texto = this.searchTerm.toLowerCase();
        return prod.name.toLowerCase().includes(texto) ||
               (prod.description && prod.description.toLowerCase().includes(texto));
      }
      
      if (this.selectedCategory !== 0) {
        const idDeCategoriaDelProducto = prod.categoryId || (prod.category && prod.category.id);
        return idDeCategoriaDelProducto === this.selectedCategory;
      }
      return true;
    });

    this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
}
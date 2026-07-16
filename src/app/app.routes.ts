import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Categorias } from './pages/categorias/categorias';
import { Carrito } from './pages/carrito/carrito';
import { CheckoutDatos } from './pages/checkout-datos/checkout-datos';
import { CheckoutEntrega } from './pages/checkout-entrega/checkout-entrega';
import { PedidoConfirmado } from './pages/pedido-confirmado/pedido-confirmado';
import { CheckoutResumen } from './pages/checkout-resumen/checkout-resumen';
import { Seguimiento } from './pages/seguimiento/seguimiento';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'categorias', component: Categorias },
  { path: 'carrito', component: Carrito },
  { path: 'checkout-datos', component: CheckoutDatos },
  { path: 'checkout-entrega', component: CheckoutEntrega },
  { path: 'checkout-resumen', component: CheckoutResumen}, 
  { path: 'pedido-confirmado', component: PedidoConfirmado }, 
  { path: 'seguimiento', component: Seguimiento }, 
  { path: '**', redirectTo: '' }
];
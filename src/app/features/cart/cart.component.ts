import { Product } from './../../core/models/product.model';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddToCart,
  ClearCart,
  RemoveFromCart,
} from '../../store/cart/cart.actions';
import { AsyncPipe } from '@angular/common';
import { CartItem } from '../../core/models/cart.model';
import { ProductState } from '../../store/product/product.state';
import { CartState } from '../../store/cart/cart.state';
import { FetchProducts } from '../../store/product/product.actions';

@Component({
  selector: 'app-cart',
  imports: [AsyncPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  products$ = new Observable<Product[]>();
  cart$ = new Observable<CartItem[]>();
  totalItems$ = new Observable<number>();
  totalPrice$ = new Observable<number>();

  constructor(private readonly store: Store) {
    this.products$ = this.store.select(ProductState.getProducts);
    this.cart$ = this.store.select(CartState.items);
    this.totalItems$ = this.store.select(CartState.totalItems);
    this.totalPrice$ = this.store.select(CartState.totalPrice);

    this.store.dispatch(new FetchProducts());
  }

  addToCart(product: Product) {
    this.store.dispatch(new AddToCart(product));
  }

  removeFromCart(productId: number) {
    this.store.dispatch(new RemoveFromCart(productId));
  }

  clearCart() {
    this.store.dispatch(new ClearCart());
  }
}

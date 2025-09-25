import { Product } from './../../core/models/product.model';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
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
  private readonly store = inject(Store);
  products$ = this.store.select(ProductState.getProducts);
  cart$ = this.store.select(CartState.items);
  totalItems$ = this.store.select(CartState.totalItems);
  totalPrice$ = this.store.select(CartState.totalPrice);

  constructor() {
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

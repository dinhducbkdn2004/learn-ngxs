import { Product } from './../../core/models/product.model';
import { Component, inject } from '@angular/core';
import { select, Store } from '@ngxs/store';
import {
  AddToCart,
  ClearCart,
  RemoveFromCart,
} from '../../store/cart/cart.actions';
import { ProductState } from '../../store/product/product.state';
import { CartState } from '../../store/cart/cart.state';
import { FetchProducts } from '../../store/product/product.actions';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private readonly store = inject(Store);
  products = select(ProductState.getProducts);
  cart = select(CartState.items);
  totalItems = select(CartState.totalItems);
  totalPrice = select(CartState.totalPrice);

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

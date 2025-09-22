import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import {
  AddToCart,
  RemoveFromCart,
  UpdateQty,
  ClearCart,
} from './cart.actions';
import { CartItem } from '../../core/models/cart.model';

export interface CartStateModel {
  items: CartItem[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: [],
  },
})
@Injectable()
export class CartState {
  @Selector()
  static items(state: CartStateModel) {
    return state.items;
  }

  @Selector()
  static totalItems(state: CartStateModel) {
    return state.items.reduce((sum, item) => sum + item.qty, 0);
  }

  @Selector()
  static totalPrice(state: CartStateModel) {
    return state.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  @Action(AddToCart)
  add(ctx: StateContext<CartStateModel>, { product }: AddToCart) {
    const state = ctx.getState();
    const existing = state.items.find((i) => i.id === product.id);

    if (existing) {
      ctx.patchState({
        items: state.items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    } else {
      ctx.patchState({
        items: [
          ...state.items,
          { id: product.id, name: product.title, price: product.price, qty: 1 },
        ],
      });
    }
  }

  @Action(RemoveFromCart)
  removeFromCart(
    ctx: StateContext<CartStateModel>,
    { productId }: RemoveFromCart
  ) {
    const state = ctx.getState();
    ctx.patchState({
      items: state.items.filter((item) => item.id !== productId),
    });
  }

  @Action(UpdateQty)
  updateQty(ctx: StateContext<CartStateModel>, { productId, qty }: UpdateQty) {
    const state = ctx.getState();
    ctx.patchState({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, qty } : item
      ),
    });
  }

  @Action(ClearCart)
  clearCart(ctx: StateContext<CartStateModel>) {
    ctx.patchState({ items: [] });
  }
}

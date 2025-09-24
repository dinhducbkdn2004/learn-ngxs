import { Product } from "../../core/models/product.model";

export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public product: Product) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public productId: number) {}
}

export class ClearCart {
  static readonly type = '[Cart] Clear';
}

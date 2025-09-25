import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FetchProducts } from './product.actions';
import { Product } from '../../core/models/product.model';
import { tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface ProductStateModel {
  products: Product[];
}

@State<ProductStateModel>({
  name: 'product',
  defaults: {
    products: [],
  },
})
@Injectable()
export class ProductState {
  private readonly apiService = inject(ApiService);
  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Action(FetchProducts)
  fetchProducts(ctx: StateContext<ProductStateModel>) {
    return this.apiService.getProducts().pipe(
      tap((res) => {
        ctx.patchState({ products: res.products });
      })
    );
  }
}

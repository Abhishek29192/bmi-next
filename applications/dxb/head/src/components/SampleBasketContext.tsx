import React from "react";
import { VariantOption } from "./types/pim";
//action type
export enum ACTION_TYPES {
  BASKET_ADD,
  BASKET_REMOVE
}

export interface IBasketAction {
  type: ACTION_TYPES;
  payload: VariantOption;
}

export interface IBasketState {
  products: VariantOption[];
}

//initial state
export const initialBasketState: IBasketState = {
  products: []
};

export const basketReducer = (
  state: IBasketState,
  action: IBasketAction
): IBasketState => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.BASKET_ADD: {
      const productExist = state.products.find(
        (product) => product.code === payload.code
      );
      if (productExist) {
        return state;
      } else {
        return { products: [...state.products, action.payload] };
      }
    }
    case ACTION_TYPES.BASKET_REMOVE:
      return {
        products: state.products.filter(
          (product) => product.code !== payload.code
        )
      };

    default:
      return state;
  }
};

export interface BasketContextProps {
  basketState: IBasketState;
  basketDispatch: React.Dispatch<IBasketAction>;
}

export const BasketContext = React.createContext<BasketContextProps>({
  basketState: initialBasketState,
  basketDispatch: () => {}
});

export const BasketContextConsumer = BasketContext.Consumer;
export const BasketContextProvider = BasketContext.Provider;
export default BasketContext;

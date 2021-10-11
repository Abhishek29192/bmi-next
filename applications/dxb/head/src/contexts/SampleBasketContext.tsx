import React, { useReducer, useEffect } from "react";
import { VariantOption } from "../components/types/pim";
//action type
export enum ACTION_TYPES {
  BASKET_ADD,
  BASKET_REMOVE
}

export interface ISample extends VariantOption {
  name: string;
}

export interface IBasketAction {
  type: ACTION_TYPES;
  payload: ISample;
}

export interface IBasketState {
  products: ISample[];
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
export const BasketContextProvider = ({
  children
}: {
  children: React.ReactChild | React.ReactChildren;
}) => {
  //for context setup for sample shopping basket
  const [basketState, basketDispatch] = useReducer(
    basketReducer,
    initialBasketState,
    () => {
      return typeof window !== "undefined" &&
        localStorage.getItem("basketItems")
        ? { products: JSON.parse(localStorage.getItem("basketItems")) }
        : { products: [] };
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("basketItems", JSON.stringify(basketState.products));
    }
  }, [basketState]);

  const basketContextValues = {
    basketState,
    basketDispatch
  };

  return (
    <BasketContext.Provider value={basketContextValues}>
      {children}
    </BasketContext.Provider>
  );
};
export default BasketContext;

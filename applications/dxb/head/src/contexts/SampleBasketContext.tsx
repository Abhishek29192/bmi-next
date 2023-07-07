import React, { useContext, useEffect, useReducer } from "react";
import { useIsClient } from "@bmi-digital/components";
import { Measurements } from "@bmi/firestore-types";
import { useSiteContext } from "../components/Site";
import { Product } from "../types/pim";
import { local } from "../utils/storage";

//action type
export enum ACTION_TYPES {
  BASKET_ADD,
  BASKET_REMOVE,
  BASKET_CLEAR,
  BASKET_REPLACE
}

export interface Sample {
  name: Product["name"];
  code: Product["code"];
  path: Product["path"];
  colour: Product["colour"];
  textureFamily: Product["textureFamily"];
  measurements?: Measurements["label"];
  image?: string;
}

export interface SampleOrderElement {
  id: string;
  title: string;
  url: string;
  color: string;
  texture: string;
}

export const createSample = (product: Product): Sample => ({
  name: product.name,
  code: product.code,
  path: product.path,
  colour: product.colour,
  textureFamily: product.textureFamily,
  measurements: product.measurements?.label,
  image: product.masterImage?.mainSource
});

export type BasketAction =
  | {
      type:
        | ACTION_TYPES.BASKET_ADD
        | ACTION_TYPES.BASKET_REMOVE
        | ACTION_TYPES.BASKET_CLEAR;
      payload?: Sample;
    }
  | {
      type: ACTION_TYPES.BASKET_REPLACE;
      payload: Sample[];
    };

export interface BasketState {
  products: Sample[];
}

//initial state
export const initialBasketState: BasketState = {
  products: []
};

export const basketReducer = (
  state: BasketState,
  action: BasketAction
): BasketState => {
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
    case ACTION_TYPES.BASKET_REPLACE:
      return {
        products: payload
      };

    case ACTION_TYPES.BASKET_CLEAR:
      return initialBasketState;

    default:
      return state;
  }
};

export interface BasketContextProps {
  basketState: BasketState;
  basketDispatch: React.Dispatch<BasketAction>;
}

export const BasketContext = React.createContext<BasketContextProps>({
  basketState: initialBasketState,
  basketDispatch: () => {
    // no-op
  }
});

export const useBasketContext = () => useContext(BasketContext);
export const BasketContextConsumer = BasketContext.Consumer;
export const BasketContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { countryCode } = useSiteContext();
  const { isClient } = useIsClient();
  //for context setup for sample shopping basket
  const [basketState, basketDispatch] = useReducer(
    basketReducer,
    initialBasketState,
    () => ({ products: [] })
  );

  useEffect(() => {
    if (isClient) {
      local.setItem(
        `${countryCode}-basketItems`,
        JSON.stringify(basketState.products)
      );
    }
  }, [basketState, countryCode, isClient]);

  useEffect(() => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_REPLACE,
      payload: JSON.parse(local.getItem(`${countryCode}-basketItems`)) || []
    });
  }, []);

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

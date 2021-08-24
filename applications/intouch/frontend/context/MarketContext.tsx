import React, { useState, createContext, useEffect } from "react";
import { Market } from "@bmi/intouch-api-types";

export type ContextProps = {
  market: Omit<
    Market,
    // we don't need all the nested relations for now
    | "accounts"
    | "companies"
    | "companyMembers"
    | "products"
    | "systems"
    | "systemMembers"
  >;
};

type ContextWrapperProps = ContextProps & {
  children?: React.ReactNode;
};

export const MarketContext = createContext<ContextProps>(null);
export const useMarketContext = () => React.useContext(MarketContext);

const MarketContextWrapper = ({ market, children }: ContextWrapperProps) => {
  const [currentMarket, setCurrentMarket] =
    useState<ContextProps["market"]>(market);

  useEffect(() => {
    setCurrentMarket(market);
  }, [market]);

  return (
    <MarketContext.Provider value={{ market: currentMarket }}>
      {children}
    </MarketContext.Provider>
  );
};

export default MarketContextWrapper;

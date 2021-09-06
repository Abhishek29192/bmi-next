import React, { useState, createContext, useEffect } from "react";
import { GetMarketsByDomainQuery } from "../graphql/generated/operations";

export type ContextProps = {
  market: GetMarketsByDomainQuery["markets"]["nodes"][0];
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

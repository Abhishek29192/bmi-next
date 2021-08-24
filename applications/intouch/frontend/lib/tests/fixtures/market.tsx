import React from "react";
import MarketContextWrapper, {
  ContextProps
} from "../../../context/MarketContext";
import { generateMarketContext } from "../factories/market";

const Wrapper = ({
  market = generateMarketContext(),
  children
}: {
  market?: ContextProps["market"];
  children: React.ReactNode;
}) => {
  return (
    <MarketContextWrapper market={market}>{children}</MarketContextWrapper>
  );
};

export default Wrapper;

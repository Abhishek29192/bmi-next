import React from "react";
import { Market } from "@bmi/intouch-api-types";
import MarketContextWrapper from "../../../context/MarketContext";
import { generateMarket } from "../factories/market";

const Wrapper = ({
  market = generateMarket(),
  children
}: {
  market?: Partial<Market>;
  children: React.ReactNode;
}) => {
  return (
    <MarketContextWrapper market={market}>{children}</MarketContextWrapper>
  );
};

export default Wrapper;

import React from "react";
import { stringifyAddress } from "../../lib/utils/address";
import { AddressProps } from "./index";

export const InlineAddress = ({ address }: AddressProps) => {
  if (!address) {
    return null;
  }
  return <div data-testid="address">{stringifyAddress(address, ", ")}</div>;
};

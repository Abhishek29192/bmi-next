import React from "react";
import { Address as AddressType } from "@bmi/intouch-api-types";

export type AddressProps = {
  address: AddressType;
};

export const Address = ({ address }: AddressProps) => (
  <div>
    {address.firstLine ? <div>{address.firstLine}</div> : null}
    {address.secondLine ? <div>{address.secondLine}</div> : null}
    {address.town ? <div>{address.town}</div> : null}
    {address.postcode ? <div>{address.postcode}</div> : null}
  </div>
);

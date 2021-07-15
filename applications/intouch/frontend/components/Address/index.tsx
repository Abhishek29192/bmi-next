import React from "react";
import { Address as AddressType } from "@bmi/intouch-api-types";
import { gql } from "@apollo/client";

export type AddressProps = {
  address: Pick<
    AddressType,
    "firstLine" | "secondLine" | "town" | "region" | "country" | "postcode"
  >;
};

export const Address = ({ address }: AddressProps) => (
  <div>
    {address?.firstLine ? <div>{address.firstLine}</div> : null}
    {address?.secondLine ? <div>{address.secondLine}</div> : null}
    {address?.town ? <div>{address.town}</div> : null}
    {address?.region ? <div>{address.region}</div> : null}
    {address?.postcode ? <div>{address.postcode}</div> : null}
    {address?.country ? <div>{address.country}</div> : null}
  </div>
);

export const AddressLinesFragment = gql`
  fragment AddressLinesFragment on Address {
    firstLine
    secondLine
    town
    region
    country
    postcode
  }
`;

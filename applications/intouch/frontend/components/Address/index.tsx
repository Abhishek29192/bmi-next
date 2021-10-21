import React from "react";
import { Address as AddressType } from "@bmi/intouch-api-types";
import { gql } from "@apollo/client";

export type AddressProps = {
  address: Pick<
    AddressType,
    "firstLine" | "secondLine" | "town" | "region" | "country" | "postcode"
  >;
};

export const Address = ({ address }: AddressProps) => {
  if (!address) {
    return null;
  }
  return (
    <div data-testid="address">
      {["firstLine", "secondLine", "postcode", "town", "region", "country"]
        .filter((addressLine) => !!address[addressLine])
        .map((addressLine) => (
          <div key={addressLine} data-testid={`addressLine-${addressLine}`}>
            {address[addressLine]}
          </div>
        ))}
    </div>
  );
};

export const AddressLinesFragment = gql`
  fragment AddressLinesFragment on Address {
    id
    firstLine
    secondLine
    town
    region
    country
    postcode
  }
`;

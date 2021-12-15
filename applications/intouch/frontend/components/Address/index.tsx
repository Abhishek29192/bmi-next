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
        // eslint-disable-next-line security/detect-object-injection
        .filter((addressLine) => !!address[addressLine])
        .map((addressLine) => (
          <div key={addressLine} data-testid={`addressLine-${addressLine}`}>
            {/* eslint-disable-next-line security/detect-object-injection */}
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

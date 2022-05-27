import { Address } from "@bmi/intouch-api-types";

export const stringifyAddress = (address: Partial<Address>, separator = " ") =>
  [
    address?.firstLine,
    address?.secondLine,
    address?.postcode,
    address?.town,
    address?.country
  ]
    .filter(Boolean)
    .join(separator);

export const copyOfSiteAddress = (address: Partial<Address>) => {
  const { id, __typename, ...parentSiteAddress } = address;
  return parentSiteAddress;
};

export const copyOfBuildingOwnerAddress = (address: Partial<Address>) => {
  const { id, __typename, ...parentBuildingOwnerAddress } = address;
  return parentBuildingOwnerAddress;
};

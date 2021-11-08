import { Address } from "@bmi/intouch-api-types";

export const stringifyAddress = (address: Partial<Address>) =>
  [
    address?.firstLine,
    address?.secondLine,
    address?.postcode,
    address?.town,
    address?.country
  ]
    .filter(Boolean)
    .join(" ");

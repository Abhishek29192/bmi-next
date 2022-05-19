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

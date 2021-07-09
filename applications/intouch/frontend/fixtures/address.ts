import { Address } from "@bmi/intouch-api-types";

export const mockAddress: Partial<Address> = {
  firstLine: "Nursery Rd",
  secondLine: "Brixton",
  town: "London",
  region: null,
  country: "UK",
  postcode: "SW9 8BP",
  coordinates: { x: 51.4632583, y: -0.1194107 }
};

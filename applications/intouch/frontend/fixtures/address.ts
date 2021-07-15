import { Address } from "@bmi/intouch-api-types";

export const mockAddress: Partial<Address> = {
  firstLine: "Nursery Rd",
  secondLine: "Brixton",
  postcode: "SW9 8BP",
  town: "London",
  region: "Some Region",
  country: "UK",
  coordinates: { x: 51.4632583, y: -0.1194107 }
};

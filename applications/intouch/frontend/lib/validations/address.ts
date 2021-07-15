import { Address } from "@bmi/intouch-api-types";
import { validateObject } from "./utils";

export const addressMandatoryFields = [
  "firstLine",
  "country",
  "postcode",
  "coordinates.x",
  "coordinates.y"
];

export type AddressMandatoryFields = typeof addressMandatoryFields;

export const validateAddress = (
  address: Partial<Address>
): { result: boolean; missingFields: AddressMandatoryFields } =>
  validateObject(address, addressMandatoryFields);

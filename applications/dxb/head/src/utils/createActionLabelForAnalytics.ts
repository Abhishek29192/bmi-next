import { Measurements } from "@bmi/firestore-types";
import { AnchorLinkProps } from "@bmi-digital/components";
import { Product } from "../types/pim";

export const createActionLabel = (
  name: Product["name"],
  colour: Product["colour"],
  textureFamily: Product["textureFamily"],
  measurements?: Measurements["label"]
): string => {
  return [name, colour, textureFamily, measurements]
    .filter((attribute) => attribute)
    .join("-");
};

export const stringifyToObject = (to?: AnchorLinkProps["to"]) => {
  if (!to) {
    return;
  }

  return typeof to === "string" ? to : JSON.stringify(to);
};

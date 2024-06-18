import { Measurements } from "@bmi/firestore-types";
import { Product } from "../types/pim";
import type { AnchorLinkProps } from "@bmi-digital/components/anchor-link";

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

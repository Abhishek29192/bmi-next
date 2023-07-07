import { Measurements } from "@bmi/firestore-types";
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

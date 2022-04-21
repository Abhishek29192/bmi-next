import { Product } from "../types/pim";

export const createActionLabel = (
  name: Product["name"],
  colour: Product["colour"],
  textureFamily: Product["textureFamily"],
  measurements: Product["measurements"]["label"] | null
): string => {
  return [name, colour, textureFamily, measurements]
    .filter((attribute) => attribute)
    .join("-");
};

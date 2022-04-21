import { Node } from "./Gatsby";

export type Resource = Node & {
  keyAssetTypes: string[] | null;
};

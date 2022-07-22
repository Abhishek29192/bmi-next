/**
 * These types are not fully complete, they are just here to allow type
 * expectations for the resolvers. These types should match what is in the
 * main types, but with any "link" fields and without any resolver created
 * fields.
 */
import {
  Mime,
  ProductDocument as FirestoreProductDocument
} from "@bmi/firestore-types";
import { Node } from "gatsby";

export type ProductDocument = Node &
  Omit<
    FirestoreProductDocument,
    "realFileName" | "fileSize" | "format" | "extension"
  > & {
    realFileName: string | null;
    fileSize: number | null;
    format: Mime | null;
    extension: string | null;
    __typename: "PIMDocument";
    assetType___NODE: string;
  };

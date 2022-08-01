import { ProductFilter } from "../../../types/pim";
import { ContentfulDocument } from "./Contentful";
import { ProductDocument } from "./pim";

export type DocumentsWithFilters = {
  documents: (ProductDocument | ContentfulDocument)[];
  filters: ProductFilter[];
};

export type ContentfulDocumentsWithFilters = {
  documents: ContentfulDocument[];
  filters: ProductFilter[];
};

export type ProductDocumentsWithFilters = {
  documents: ProductDocument[];
  filters: ProductFilter[];
};

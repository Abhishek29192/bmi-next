import { Data as ContentfulDocument } from "./Document";
import { ProductDocument, ProductFilter } from "./pim";

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

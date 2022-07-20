import { ContentfulDocument } from "./Document";
import { ProductDocument, ProductFilter } from "./pim";

export type DocumentsWithFilters = {
  documents: (ProductDocument | ContentfulDocument)[];
  filters: ProductFilter[];
};

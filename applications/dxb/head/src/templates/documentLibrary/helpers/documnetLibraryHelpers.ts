import { Data as DocumentResultsData } from "../../../components/DocumentResults";
import { Source } from "../../../utils/filters";

const sourceToSortMap: Record<
  Source,
  (documents: DocumentResultsData) => DocumentResultsData
> = {
  ALL: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a.assetType.name > b.assetType.name
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a.assetType.name < b.assetType.name
          ? -1
          : 0
      ),
  PIM: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a.assetType.code > b.assetType.code
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a.assetType.code < b.assetType.code
          ? -1
          : 0
      ),
  CMS: (documents) =>
    documents
      .concat()
      .sort((a, b) =>
        a["brand"] > b["brand"]
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a["brand"] < b["brand"]
          ? -1
          : 0
      )
};

export { sourceToSortMap };

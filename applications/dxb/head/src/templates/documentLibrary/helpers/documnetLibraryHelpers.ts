import { DocumentResultData } from "../../../components/DocumentResults";
import { Source } from "../../../utils/filters";

const sourceToSortMap: Record<
  Source,
  (documents: DocumentResultData[]) => DocumentResultData[]
> = {
  ALL: (documents) =>
    (documents || [])
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
    (documents || [])
      .concat()
      .sort((a, b) =>
        a.assetType.pimCode > b.assetType.pimCode
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a.assetType.pimCode < b.assetType.pimCode
          ? -1
          : 0
      ),
  CMS: (documents) => {
    const docs = (documents || []).concat();
    const isAllDocsHaveBrand = docs.every((doc) => Boolean(doc["brand"]));

    if (isAllDocsHaveBrand) {
      return docs.sort((a, b) =>
        a["brand"] > b["brand"]
          ? a.title > b.title
            ? 1
            : a.title < b.title
            ? -1
            : 0
          : a["brand"] < b["brand"]
          ? -1
          : 0
      );
    } else {
      return docs.sort((a, b) => (a.title > b.title ? 1 : -1));
    }
  }
};

export { sourceToSortMap };

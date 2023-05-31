import { ContentfulDocument } from "@bmi/elasticsearch-types";
import {
  getChunks,
  getEsClient,
  getIndexOperation,
  IndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";

export const indexIntoES = async (documents: ContentfulDocument[]) => {
  const client = await getEsClient();
  const documentWriteIndexName =
    `${process.env.ES_INDEX_NAME_DOCUMENTS}_write`.toLowerCase();

  const bulkOperations = getChunks(documents).map((documents) =>
    documents.reduce<(IndexOperation | ContentfulDocument)[]>(
      (allOperations, document) => [
        ...allOperations,
        ...getIndexOperation<ContentfulDocument>(
          documentWriteIndexName,
          document,
          document.id
        )
      ],
      []
    )
  );

  await performBulkOperations(client, bulkOperations, documentWriteIndexName);
};

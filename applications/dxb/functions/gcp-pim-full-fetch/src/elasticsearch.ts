import { ContentfulDocument, Training } from "@bmi/elasticsearch-types";
import {
  getChunks,
  getEsClient,
  getIndexOperation,
  IndexOperation,
  performBulkOperations
} from "@bmi/functions-es-client";

export const indexIntoES = async (
  documents: (ContentfulDocument | Training)[],
  indexName: string
) => {
  const client = await getEsClient();
  const writeIndexName = `${indexName}_write`.toLowerCase();

  const bulkOperations = getChunks(documents).map((documents) =>
    documents.reduce<(IndexOperation | ContentfulDocument | Training)[]>(
      (allOperations, document) => [
        ...allOperations,
        ...getIndexOperation<ContentfulDocument | Training>(
          writeIndexName,
          document,
          document.id
        )
      ],
      []
    )
  );

  await performBulkOperations(client, bulkOperations, writeIndexName);
};

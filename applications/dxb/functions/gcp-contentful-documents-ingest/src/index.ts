import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { transformDocument } from "./documentTransformer";
import {
  checkAuthorization,
  checkEnvVariablesMissing,
  checkHttpMethod
} from "./helpers";
import type { HttpFunction } from "@google-cloud/functions-framework";
import type { ContentfulDocument, DeletedEntry } from "./types";

export const updateESDocumentsIndex: HttpFunction = async (
  request,
  response
) => {
  if (
    checkEnvVariablesMissing(response) ||
    checkAuthorization(request, response) ||
    checkHttpMethod(request, response)
  ) {
    return;
  }

  const body: ContentfulDocument | DeletedEntry | undefined = request.body;

  if (body?.sys?.contentType.sys.id !== "document") {
    logger.warning({
      message:
        "Function doesn't support webhooks with contentType ID other then 'document.'"
    });
    return response.sendStatus(400);
  }
  const client = await getEsClient();
  const indexName =
    `${process.env.ES_INDEX_NAME_DOCUMENTS}_write`.toLowerCase();

  if (isDocumentEntry(body)) {
    let esDocument;
    try {
      esDocument = await transformDocument(body);
    } catch (error) {
      return response.sendStatus(400);
    }

    const esResponse = await client.index({
      index: indexName,
      id: esDocument.id,
      body: esDocument
    });
    logger.info({
      message: `Document with ID = "${esResponse.body._id}" was ${esResponse.body.result}.`
    });

    return response.sendStatus(200);
  }

  const esResponse = await client.delete({
    index: indexName,
    id: request.body?.sys?.id
  });
  logger.info({
    message: `Document with ID = "${esResponse.body._id}" was ${esResponse.body.result}.`
  });

  response.sendStatus(200);
};

const isDocumentEntry = (
  body: ContentfulDocument | DeletedEntry
): body is ContentfulDocument => body.sys.type === "Entry";

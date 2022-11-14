import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { HttpFunction } from "@google-cloud/functions-framework";
import { Entry } from "contentful";
import { transformDocument } from "./documentTransformer";
import {
  checkAuthorization,
  checkEnvVariablesMissing,
  checkHttpMethod
} from "./helpers";
import { ContentfulDocument } from "./types";

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

  const body: Entry<ContentfulDocument> | undefined = request.body;

  if (body?.sys.contentType.sys.id !== "document") {
    logger.warning({
      message:
        "Function doesn't support webhooks with contentType ID other then 'document.'"
    });
    return response.sendStatus(400);
  }
  const client = await getEsClient();

  if (body.sys.type === "Entry") {
    let esDocument;
    try {
      esDocument = await transformDocument(body);
    } catch (error) {
      return response.sendStatus(400);
    }

    const esResponse = await client.index({
      index: process.env.ES_INDEX_NAME_DOCUMENTS!,
      id: esDocument.id,
      body: esDocument
    });
    logger.info({
      message: `Document with ID = "${esResponse.body._id}" was ${esResponse.body.result}.`
    });

    return response.sendStatus(200);
  }

  const esResponse = await client.delete({
    index: process.env.ES_INDEX_NAME_DOCUMENTS!,
    id: request.body?.sys?.id
  });
  logger.info({
    message: `Document with ID = "${esResponse.body._id}" was ${esResponse.body.result}.`
  });

  response.sendStatus(200);
};

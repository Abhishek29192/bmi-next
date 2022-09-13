import logger from "@bmi-digital/functions-logger";
import { getEsClient } from "@bmi/functions-es-client";
import { HttpFunction } from "@google-cloud/functions-framework";
import {
  checkAuthorization,
  checkEnvVariables,
  checkHttpMethod,
  handleEsClientError,
  transformDocument
} from "./helpers";

const EntryType = {
  ENTRY: "Entry",
  DELETED_ENTRY: "DeletedEntry"
};

export const updateESDocumentsIndex: HttpFunction = async (
  request,
  response
) => {
  const isAuthorizationFaild = await checkAuthorization(request, response);
  const isEnvVariablesMissed = checkEnvVariables(response);
  const isHttpWrongMethod = checkHttpMethod(request, response);

  if (isEnvVariablesMissed || isAuthorizationFaild || isHttpWrongMethod) {
    return;
  }

  logger.info({ message: `request: ${JSON.stringify(request)}` });

  if (request.body?.sys?.contentType?.sys?.id !== "document") {
    logger.warning({
      message:
        "Function doesn't support webhooks with contentType ID other then 'document.'"
    });
    return response.sendStatus(400);
  }
  const index = `${process.env.ES_INDEX_NAME_DOCUMENTS}`;
  const client = await getEsClient();

  switch (request.body?.sys?.type) {
    case EntryType.ENTRY: {
      const eSDocument = await transformDocument(request.body);
      if (!eSDocument) {
        logger.error({ message: "Nothing to index" });
        return;
      }
      await client.index(
        {
          index,
          id: eSDocument.id,
          body: eSDocument
        },
        handleEsClientError
      );
      break;
    }
    case EntryType.DELETED_ENTRY: {
      await client.delete(
        {
          index,
          id: request.body?.sys?.id
        },
        handleEsClientError
      );
      break;
    }
    default:
      logger.warning({ message: `Webhook provides wrong type.` });
  }
  response.sendStatus(200);
};

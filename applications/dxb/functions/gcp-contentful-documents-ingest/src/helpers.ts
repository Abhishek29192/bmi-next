import logger from "@bmi-digital/functions-logger";
import { getSecret } from "@bmi-digital/functions-secret-client";
import { ApiError, ApiResponse } from "@elastic/elasticsearch";
import { Request, Response } from "@google-cloud/functions-framework";
import { createClient, Entry, Environment, Space } from "contentful-management";
import { ContentfulAsset, ESContentfulDocument } from "./es-model";

const SECRET_MIN_LENGTH = 10;

export const transformDocument = async (
  entryData: Entry
): Promise<ESContentfulDocument> => {
  const locale = process.env.LOCALE;
  const environment = await getEnvironment();
  const { title, asset, assetType, brand, noIndex } = entryData.fields;

  const {
    fields: { file }
  } = await environment.getAsset(
    // eslint-disable-next-line security/detect-object-injection
    asset[`${locale}`].sys.id
  );
  const {
    fields: { name, code, pimCode }
  } = await environment.getEntry(
    // eslint-disable-next-line security/detect-object-injection
    assetType[`${locale}`].sys.id
  );

  return {
    __typename: "ContentfulDocument",
    id: entryData.sys.id,
    title: title[`${locale}`],
    titleAndSize: `${title[`${locale}`]}_${
      /* istanbul ignore next */
      file[`${locale}`].details?.size
    }`,
    realFileName: file[`${locale}`].fileName,
    asset: {
      file: {
        ...(file[`${locale}`] as ContentfulAsset["file"]),
        contentType: "application/pdf"
      }
    },
    assetType: {
      name: name[`${locale}`],
      code: code[`${locale}`],
      ...(pimCode && { pimCode: pimCode[`${locale}`] })
    },
    ...(Object.prototype.hasOwnProperty.call(entryData.fields, "noIndex") && {
      noIndex: noIndex[`${locale}`]
    }),
    ...(brand && {
      BRAND: {
        name: brand[`${locale}`],
        code: brand[`${locale}`]
      }
    })
  };
};

export const checkEnvVariables = (response: Response) => {
  if (!process.env.ES_DOCUMENTS_INGEST_SECRET) {
    logger.error({ message: "Request secret is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.ES_DOCUMENTS_INDEX_NAME) {
    logger.error({ message: "ES_INDEX_NAME has not been set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN_SECRET) {
    logger.error({ message: "Management access token is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.SPACE_ID) {
    logger.error({ message: "Space id is not set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.CONTENTFUL_ENVIRONMENT) {
    logger.error({ message: "Contentful environment is not set." });
    response.sendStatus(500);
    return true;
  }
};

export const checkAuthorization = async (
  request: Request,
  response: Response
) => {
  const reqSecret = await getSecret(process.env.ES_DOCUMENTS_INGEST_SECRET!);
  if (
    reqSecret.length < SECRET_MIN_LENGTH ||
    request.headers.authorization?.substring("Bearer ".length) !== reqSecret
  ) {
    logger.warning({ message: "Authorisation failed." });
    response.sendStatus(401);
    return true;
  }
};

export const checkHttpMethod = (request: Request, response: Response) => {
  if (request.method !== "POST") {
    logger.warning({
      message: `Request method ${request.method} is not allowed.`
    });
    response.sendStatus(405);
    return true;
  }
};

const getSpace = async (): Promise<Space> => {
  const client = createClient({
    accessToken: await getSecret(process.env.MANAGEMENT_ACCESS_TOKEN_SECRET!)
  });

  return await client.getSpace(process.env.SPACE_ID!);
};

let environmentCache: Environment | undefined;
export const getEnvironment = async (): Promise<Environment> => {
  if (!environmentCache) {
    const space = await getSpace();

    environmentCache = await space.getEnvironment(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.CONTENTFUL_ENVIRONMENT!
    );
  }
  return environmentCache;
};

export const handleEsClientError = (error: ApiError, response: ApiResponse) => {
  if (error.message) {
    logger.error({ message: `[ERROR]: ${error.message}` });
  } else {
    logger.info({
      message: `Document with ID = "${response.body._id}" was ${response.body.result}.`
    });
  }
};

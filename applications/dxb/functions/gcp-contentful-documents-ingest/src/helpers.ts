import logger from "@bmi-digital/functions-logger";
import { ApiError, ApiResponse } from "@elastic/elasticsearch";
import { Request, Response } from "@google-cloud/functions-framework";
import {
  AssetProps,
  createClient,
  Entry,
  EntryProps,
  Environment,
  Space
} from "contentful-management";
import { ESContentfulDocument } from "./es-model";

const SECRET_MIN_LENGTH = 10;

interface ContentfulReference {
  Entry?: EntryProps[];
  Asset?: AssetProps[];
}

type ReferenceType = "Entry" | "Asset";

const getReferenceById = (
  references: ContentfulReference,
  referenceId: string,
  referenceType: ReferenceType
) => {
  if (references) {
    // eslint-disable-next-line security/detect-object-injection
    return references[referenceType]?.find(
      ({ sys: { id } }) => id === referenceId
    )?.fields;
  }
};

export const transformDocument = async (
  entryData: Entry
): Promise<ESContentfulDocument> => {
  const locale = process.env.MARKET_LOCALE;
  const environment = await getEnvironment();
  const { title, asset, assetType, brand, noIndex, featuredMedia } =
    entryData?.fields;

  const { includes: entryReferences } = await environment.getEntryReferences(
    entryData.sys.id,
    { include: 5 }
  );
  const assetRefernce = getReferenceById(
    entryReferences!,
    asset[`${locale}`].sys.id,
    asset[`${locale}`].sys.linkType
  );
  const assetTypeReference = getReferenceById(
    entryReferences!,
    assetType[`${locale}`].sys.id,
    assetType[`${locale}`].sys.linkType
  );
  const featuredMediaReference =
    featuredMedia &&
    getReferenceById(
      entryReferences!,
      featuredMedia[`${locale}`].sys.id,
      featuredMedia[`${locale}`].sys.linkType
    );

  const featuredMediaReferenceAsset =
    featuredMediaReference &&
    getReferenceById(
      entryReferences!,
      featuredMediaReference.image[`${locale}`].sys.id,
      featuredMediaReference.image[`${locale}`].sys.linkType
    );

  return {
    __typename: "ContentfulDocument",
    id: entryData.sys.id,
    title: title[`${locale}`],
    titleAndSize: `${title[`${locale}`]}_${
      /* istanbul ignore next */
      assetRefernce?.file[`${locale}`].details?.size
    }`,
    realFileName: assetRefernce?.file[`${locale}`].fileName,
    asset: {
      file: {
        ...assetRefernce?.file[`${locale}`]
      }
    },
    assetType: {
      id: assetType[`${locale}`].sys.id,
      name: assetTypeReference?.name[`${locale}`],
      code: assetTypeReference?.code[`${locale}`],
      ...(assetTypeReference?.pimCode && {
        pimCode: assetTypeReference?.pimCode[`${locale}`]
      }),
      ...(assetTypeReference?.description && {
        description: assetTypeReference?.description[`${locale}`]
      })
    },
    ...(Object.prototype.hasOwnProperty.call(entryData.fields, "noIndex") && {
      noIndex: noIndex[`${locale}`]
    }),
    ...(brand && {
      BRAND: {
        name: brand[`${locale}`],
        code: brand[`${locale}`]
      }
    }),
    ...(featuredMedia && {
      featuredMedia: {
        title: featuredMediaReference.title[`${locale}`],
        altText: featuredMediaReference.altText[`${locale}`],
        image: {
          title: featuredMediaReferenceAsset.title[`${locale}`],
          ...(featuredMediaReferenceAsset?.description && {
            description: featuredMediaReferenceAsset.description[`${locale}`]
          }),
          file: {
            ...featuredMediaReferenceAsset.file[`${locale}`]
          }
        }
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
  if (!process.env.ES_INDEX_NAME_DOCUMENTS) {
    logger.error({ message: "ES_INDEX_NAME has not been set." });
    response.sendStatus(500);
    return true;
  }
  if (!process.env.MANAGEMENT_ACCESS_TOKEN) {
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
  if (!process.env.MARKET_LOCALE) {
    logger.error({ message: "MARKET_LOCALE is not set." });
    response.sendStatus(500);
    return true;
  }
};

export const checkAuthorization = (request: Request, response: Response) => {
  const reqSecret = process.env.ES_DOCUMENTS_INGEST_SECRET!;
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
    accessToken: process.env.MANAGEMENT_ACCESS_TOKEN!
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

export const handleEsClientError = ({
  error,
  response
}: {
  error?: ApiError;
  response?: ApiResponse;
}) => {
  if (error?.message) {
    logger.error({ message: `[ERROR]: ${error?.message}` });
  } else {
    logger.info({
      message: `Document with ID = "${response?.body._id}" was ${response?.body.result}.`
    });
  }
};

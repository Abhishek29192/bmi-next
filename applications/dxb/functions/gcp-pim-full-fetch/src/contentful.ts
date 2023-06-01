import { getContentfulClient } from "@bmi/functions-contentful-client";
import {
  TypeDocument as ContentfulDocument,
  TypeDocumentSkeleton as ContentfulDocumentSkeleton
} from "@bmi/contentful-types";

// The maximum number of entries returned by the API is 1000.
// The API will throw a BadRequestError for values higher than 1000 and values other than an integer.
// The default number of entries returned by the API is 100.
const MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE = 1000;

export const getDocuments = async (
  locale: string,
  page: number,
  tag?: string
): Promise<ContentfulDocument<undefined, string>[]> => {
  const client = getContentfulClient();
  const response = await client.getEntries<ContentfulDocumentSkeleton>({
    content_type: "document",
    locale,
    skip: page * MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE,
    limit: MAX_NUMBER_OF_DOCUMENTS_PER_RESPONSE,
    ...(tag && { "metadata.tags.sys.id[all]": tag })
  });
  if (response.errors) {
    throw new Error(`Errors: ${JSON.stringify(response.errors)}`);
  }
  return response.items;
};

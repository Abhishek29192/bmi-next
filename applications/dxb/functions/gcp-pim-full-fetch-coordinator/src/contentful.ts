import { getContentfulClient } from "@bmi/functions-contentful-client";

export const getNumberOfDocuments = async (
  locale: string,
  tag?: string
): Promise<number> => {
  const client = getContentfulClient();
  const response = await client.getEntries({
    content_type: "document",
    limit: 0,
    locale,
    ...(tag && { "metadata.tags.sys.id[all]": tag })
  });
  if (response.errors) {
    throw new Error(`Errors: ${JSON.stringify(response.errors)}`);
  }
  return response.total;
};

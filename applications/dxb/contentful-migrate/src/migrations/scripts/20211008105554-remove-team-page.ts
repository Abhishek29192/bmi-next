import type { CollectionResponse } from "@bmi-digital/contentful-migration";
import type { EntryProps } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove team page";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const resp: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=teamPage&limit=1000`
  });

  resp.items.forEach(async (item) => {
    console.log(`Unpublishing Team Page: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}/published`
    });
  });

  const resp2: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=teamPage&limit=1000`
  });

  resp2.items.forEach(async (item) => {
    console.log(`Deleting Team Page: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}`
    });
  });

  migration.deleteContentType("teamPage");
};

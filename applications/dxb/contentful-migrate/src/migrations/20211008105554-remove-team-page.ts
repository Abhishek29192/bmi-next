import type { CollectionProp, EntryProps } from "contentful-management";
import type { MigrationFunction } from "contentful-migration";

export const description = "Remove team page";

export const up: MigrationFunction = async (migration, context) => {
  const resp: CollectionProp<EntryProps> = await context!.makeRequest({
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

  const resp2: CollectionProp<EntryProps> = await context!.makeRequest({
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

export const down: MigrationFunction = (migration) => {
  // no-op
};

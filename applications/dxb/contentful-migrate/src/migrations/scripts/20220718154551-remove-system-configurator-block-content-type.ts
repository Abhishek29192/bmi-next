import type { CollectionResponse } from "@bmi-digital/contentful-migration";
import type { EntryProps, KeyValueMap } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";
import {
  down as systemConfiguratorBlockMigrationDown,
  up as systemConfiguratorBlockMigrationUp
} from "./20210526133509-create-system-configurator-block";

export const description = "Remove System Configurator Block content type";

const delayedRequests = (
  entries: EntryProps<KeyValueMap>[],
  cb: (item: EntryProps<KeyValueMap>) => Promise<void>
) => {
  let delay = 0;
  const delayIncrement = 200;
  return entries.map(async (entry) => {
    delay += delayIncrement;
    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      cb(entry)
    );
  });
};

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const resp: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=systemConfiguratorBlock&limit=1000`
  });

  const unpublishItem = async (entry: EntryProps<KeyValueMap>) => {
    if (
      entry.sys.firstPublishedAt &&
      entry.sys.publishedAt &&
      entry.sys.publishedCounter
    ) {
      console.log(`Unpublishing System Configurator Block: ${entry.sys.id}`);
      await context!.makeRequest({
        method: "DELETE",
        url: `/entries/${entry.sys.id}/published`
      });
    }
  };

  const unpublishedItems = delayedRequests(resp.items, unpublishItem);

  await Promise.all(unpublishedItems);

  const deleteItem = async (entry: EntryProps<KeyValueMap>) => {
    console.log(`Deleting System Configurator Block: ${entry.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${entry.sys.id}`
    });
  };

  const deletedItems = delayedRequests(resp.items, deleteItem);

  await Promise.all(deletedItems);

  systemConfiguratorBlockMigrationDown(migration);
};

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  systemConfiguratorBlockMigrationUp(migration, context!);
};

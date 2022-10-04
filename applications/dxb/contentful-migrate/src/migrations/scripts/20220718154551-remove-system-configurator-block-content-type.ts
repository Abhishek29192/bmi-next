import type { CollectionResponse } from "@bmi-digital/contentful-migration";
import type { EntryProps } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";
import {
  down as systemConfiguratorBlockMigrationDown,
  up as systemConfiguratorBlockMigrationUp
} from "./20210526133509-create-system-configurator-block";

export const description = "Remove System Configurator Block content type";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const resp: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=systemConfiguratorBlock&limit=1000`
  });

  resp.items.forEach(async (item) => {
    console.log(`Unpublishing System Configurator Block: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}/published`
    });
  });

  const resp2: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=systemConfiguratorBlock&limit=1000`
  });

  resp2.items.forEach(async (item) => {
    console.log(`Deleting System Configurator Block: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}`
    });
  });
  systemConfiguratorBlockMigrationDown(migration);
};

export const down: MigrationFunction = (
  migration: Migration,
  context?: MigrationContext
) => {
  systemConfiguratorBlockMigrationUp(migration, context!);
};

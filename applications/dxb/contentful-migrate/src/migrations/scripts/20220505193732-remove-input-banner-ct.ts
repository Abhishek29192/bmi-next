import type { CollectionResponse } from "@bmi-digital/contentful-migration";
import type { EntryProps } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";
import {
  down as inputBannerMigrationDown,
  up as inputBannerMigrationUp
} from "./20201117005321-create-input-banner-content-type.js";
import { up as retryFieldMigrationUp } from "./20210301151440-add-retry-fields.js";
import { up as nameFieldIBMigrationUp } from "./20220419133700-change-source-content-type-for-name-field-for-input-banner.js";

export const description = "remove input banner content type";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const resp: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=inputBanner&limit=1000`
  });

  resp.items.forEach(async (item) => {
    console.log(`Unpublishing Input Banner: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}/published`
    });
  });

  const resp2: CollectionResponse<EntryProps> = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=inputBanner&limit=1000`
  });

  resp2.items.forEach(async (item) => {
    console.log(`Deleting Input Banner: ${item.sys.id}`);

    await context!.makeRequest({
      method: "DELETE",
      url: `/entries/${item.sys.id}`
    });
  });
  inputBannerMigrationDown(migration);
};

export const down: MigrationFunction = (migration: Migration) => {
  inputBannerMigrationUp(migration);
  retryFieldMigrationUp(migration);
  nameFieldIBMigrationUp(migration);
};

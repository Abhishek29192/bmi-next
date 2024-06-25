import { argv } from "node:process";
import { pathToFileURL } from "node:url";
import { getContentfulClient } from "@bmi/functions-contentful-management-client";
import { isDefined, waitFor } from "@bmi/utils";
import { microCopy } from "@bmi/microcopies";
import "dotenv/config";
import { VersionedLink } from "contentful-management/dist/typings/common-types.js";
import {
  BULK_SIZE,
  CHUNK_SIZE,
  KEYS_REQUEST_PAGE_SIZE,
  TIMEOUT
} from "./constants.js";
import type {
  Entry,
  EntryProps,
  Environment,
  SysLink,
  Tag
} from "contentful-management";

const ALL_MICROCOPY_KEYS = Object.values(microCopy);

let environment: Environment | undefined;
const getEnvironment = async (): Promise<Environment> => {
  if (!environment) {
    if (!process.env.SPACE_ID) {
      throw new Error("SPACE_ID was not provided");
    }

    if (!process.env.CONTENTFUL_ENVIRONMENT) {
      throw new Error("CONTENTFUL_ENVIRONMENT was not provided");
    }

    const clientApi = getContentfulClient();
    const space = await clientApi.getSpace(process.env.SPACE_ID);
    environment = await space.getEnvironment(
      process.env.CONTENTFUL_ENVIRONMENT
    );
  }
  return environment;
};

const getValidMarketTags = async (): Promise<Tag[]> => {
  const environment = await getEnvironment();
  const marketTags = (await environment.getTags(undefined)).items.filter(
    (item: Tag) =>
      item.sys.visibility === "public" && item.sys.id.startsWith("market__")
  );

  if (marketTags.length === 0) {
    throw Error(
      `The environment '${environment.name}' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present.`
    );
  }

  return marketTags;
};

const createEntriesInBatch = async (
  chunkPayloads: Omit<EntryProps, "sys">[]
): Promise<PromiseSettledResult<Entry>[]> => {
  const entriesToCreate = chunkPayloads.slice(0, CHUNK_SIZE);
  if (entriesToCreate.length === 0) {
    return [];
  }
  const environment = await getEnvironment();
  const results = await Promise.allSettled(
    entriesToCreate.map(async (payloadItem) =>
      environment.createEntry("resource", {
        fields: payloadItem.fields,
        metadata: payloadItem.metadata
      })
    )
  );
  await waitFor(TIMEOUT);

  return [
    ...results,
    ...(await createEntriesInBatch(chunkPayloads.slice(CHUNK_SIZE)))
  ];
};

const createEntriesAndReturnFulfilledResponse = async (
  allEntryPayloads: Omit<EntryProps, "sys">[]
): Promise<VersionedLink<"Entry">[]> => {
  const results = await createEntriesInBatch(allEntryPayloads);

  console.log(
    `Entry creation finished. Created ${results.length} of ${allEntryPayloads.length} entries.`
  );

  const rejected = results
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    )
    .map((entries) => {
      console.log(`Failed to upload: ${JSON.stringify(entries.reason)}`);
      return entries.reason;
    });

  const fulfilled = results.filter(
    (result): result is PromiseFulfilledResult<Entry> =>
      result.status === "fulfilled"
  );

  console.log(`${fulfilled.length} entries created in contentful.`);

  if (rejected.length > 0) {
    throw new Error(
      `${rejected.length} entries failed to be created in contentful.`
    );
  }

  return fulfilled.map(({ value }) => ({
    sys: {
      linkType: "Entry",
      type: "Link",
      id: value.sys.id,
      version: value.sys.version
    }
  }));
};

const getContentfulMicroCopies = async (
  marketTag?: Tag,
  fetched: Entry[] = [],
  total = -1
): Promise<Entry[]> => {
  if (fetched.length === total) {
    return fetched;
  }
  const environment = await getEnvironment();
  const resources = await environment.getEntries({
    content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
    skip: fetched.length,
    limit: KEYS_REQUEST_PAGE_SIZE,
    ...(marketTag && {
      "metadata.tags.sys.id[in]": marketTag.sys.id
    })
  });

  return getContentfulMicroCopies(
    marketTag,
    [...fetched, ...resources.items],
    resources.total
  );
};

const createNewMicrocopies = async (
  microcopyKeys: string[],
  marketTag?: Tag
): Promise<VersionedLink<"Entry">[]> => {
  const environment = await getEnvironment();
  const allLocales = await environment.getLocales();
  const allLocaleCodes = allLocales.items.map((locale) => locale.code);

  const allEntryPayloads: Omit<EntryProps, "sys">[] = microcopyKeys.map(
    (entry) => {
      const keyForLocales = Object.fromEntries(
        allLocaleCodes.map((locale: string) => [locale, entry])
      );

      const valueForLocales = Object.fromEntries(
        allLocaleCodes.map((locale: string) => [locale, `MC: ${entry}`])
      );

      const fields = {
        key: keyForLocales,
        value: valueForLocales
      };

      if (marketTag) {
        return {
          metadata: {
            tags: [
              {
                sys: {
                  type: "Link",
                  linkType: "Tag",
                  id: marketTag.sys.id
                }
              }
            ]
          },
          fields: fields
        };
      } else {
        return {
          fields: fields
        };
      }
    }
  );

  console.log(
    `${
      allEntryPayloads.length
    } new Micro Copies will be created. Creating them in ${Math.round(
      allEntryPayloads.length / CHUNK_SIZE
    )} chunks...`
  );

  return await createEntriesAndReturnFulfilledResponse(allEntryPayloads);
};

const publishMicroCopies = async (nodes: VersionedLink<"Entry">[]) => {
  if (nodes.length === 0) {
    console.log("Publish action is complete");
    return;
  }

  const entriesToPublish = nodes.slice(0, BULK_SIZE);

  const environment = await getEnvironment();

  const bulk = await environment.createPublishBulkAction({
    entities: {
      sys: { type: "Array" },
      items: entriesToPublish
    }
  });

  await bulk.waitProcessing();

  console.log(`${entriesToPublish.length} successfully published`);

  await publishMicroCopies(nodes.slice(BULK_SIZE));
};

const linkMicrocopiesToResources = async (
  nodes: VersionedLink<"Entry">[],
  marketTag?: Tag
) => {
  const environment = await getEnvironment();
  const resourcesEntries = await environment.getEntries({
    content_type: "resources",
    limit: 1,
    ...(marketTag && {
      "metadata.tags.sys.id[in]": marketTag.sys.id
    })
  });

  if (resourcesEntries.total !== 1) {
    throw new Error(
      `Unable to find any resources with tag ${marketTag?.name || ""}.`
    );
  }

  const resources = resourcesEntries.items[0];
  resources.fields.microCopy = Object.entries(
    resources.fields.microCopy as {
      [locale: string]: SysLink[];
    }
  ).reduce<{
    [locale: string]: SysLink[];
  }>(
    (newMicrocopies, [key, value]) => ({
      ...newMicrocopies,
      [key]: [
        ...value,
        ...nodes.map((entry) => ({
          sys: { type: "Link", linkType: "Entry", id: entry.sys.id }
        }))
      ]
    }),
    {}
  );
  await resources.update();
};

export const main = async (
  isToBePublished: boolean,
  isConsolidated: boolean
) => {
  const marketTags = isConsolidated ? await getValidMarketTags() : [undefined];
  await Promise.all(
    marketTags.map(async (marketTag) => {
      const allContentfulMicrocopies =
        await getContentfulMicroCopies(marketTag);

      const microCopiesWithMultipleTags = allContentfulMicrocopies.filter(
        (mc) => mc.metadata && mc.metadata.tags.length > 1
      );

      if (microCopiesWithMultipleTags.length > 0) {
        console.error("Following micro copies with multiple tags identified.");
        microCopiesWithMultipleTags.forEach((mc) => {
          console.error(
            `\nContentful ID: '${mc.sys.id}' and key: ${JSON.stringify(
              mc.fields.key
            )} has more than one tag: ${JSON.stringify(mc.metadata?.tags)}`
          );
        });
        console.error(`\n`);
        throw Error(
          `Please fix multi tagged entries and start this process again.`
        );
      }

      const contentfulKeys = allContentfulMicrocopies
        .map((resource) => {
          if (resource.fields.key) {
            return Object.values(resource.fields.key)[0];
          }
        })
        .filter(isDefined);

      const microCopiesNotInContentful = ALL_MICROCOPY_KEYS.filter(
        (key) => !contentfulKeys.includes(key)
      );

      if (microCopiesNotInContentful.length === 0) {
        console.log(
          `All the micrcocopies from project are present in the environment. No brand new microcopies will be created.`
        );
        return;
      }

      const newNodes = await createNewMicrocopies(
        microCopiesNotInContentful,
        marketTag
      );

      await linkMicrocopiesToResources(newNodes, marketTag);

      if (isToBePublished) {
        console.log(`Publishing ${newNodes.length} entries`);
        await publishMicroCopies(newNodes);
      }
    })
  );
};

// istanbul ignore if -- can't override require.main
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(argv.includes("--publish"), argv.includes("--isConsolidated=true"))
    .then(() => {
      console.log("Done");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

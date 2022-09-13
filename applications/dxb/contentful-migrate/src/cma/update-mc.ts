/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*
  This script compares Micro Copies @bmi/head <---> Contentful. In case
  new Micro Copies are found - creates new for every locale and every market (tag) 
  that is used in a specific environment. By default, creates draft Micro Copies with
  an empty value

  If there is a contentful microcopy entry with multiple tags attached to it, 
  the script will stop and allow user's remove multiple tags

  It also processes existing entries from contentful and creates new entry 
  for every market / public Tag.

  When processing existing micro copy entry, it checks, 
  
  a) If an exitsing entry has NO tag, it will create a new entry for each global tag (market)
  E.g. If the environment on which this process is executed has 2 Global public Tags (market__uk + market__finland) then, 
  end result will be : 3 identical entries i.e. 1 original + 2 new entries (one per tag)
  
  b) If an existing entry has `single` tag applied,then it will create 
  a new micro copy entry for the remaining tags and sync every micro copy entry 
  for each public tag.
  
  E.g. If the environment on which this process is executed has 2 Global public Tags (market__uk + market__finland) 
  And existing entry is tagged with `UK` market, then, 
  end result will be : 2 identical entries i.e. 1 original + 1 new entry for Finland tag
  
  When this utility is called without `--publish` option, 
  i)  It will process ALL entries with ANY status 
  ii) It will NOT publish newly created entries
  iii) `value` of each entry will be left empty
  
  When this utility is called with `--publish` option, 
  i) It will only process exsiting `published`.
  ii) It will publish newly created entries
  iii) `value` of each entry will same as its `key`
*/
import { Entry, Environment, Link, Locale, Tag } from "contentful-management";
import { microCopy } from "../../../head/src/constants/microCopies";
import { getEnvironment, waitFor } from "../utils";

/*
  Contentful Management API have limitation to amount of requests
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/api-rate-limits
*/
const CHUNK_SIZE = 10;
const TIMEOUT = 1000;

/*
  Contentful Management API have limitation to size of bulk operations
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/reference/bulk-actions
*/
const BULK_SIZE = 200;

const KEYS_REQUEST_PAGE_SIZE = 100;

const TO_BE_PUBLISHED = process.argv.includes("--publish");
const IS_CONSOLIDATED = process.argv.includes("--isConsolidated=true");

type PublishEntryPayload = {
  sys: {
    linkType: string;
    type: string;
    id: any;
    version: any;
  };
};

type ResourceEntryPayload = {
  metadata?: {
    tags: Link<"Tag">[];
  };
  fields:
    | {
        key: {
          [k: string]: any;
        };
        value: {
          [k: string]: any;
        };
      }
    | {
        key: {
          [k: string]: any;
        };
        value?: undefined;
      };
};

const getValidMarketTags = async (environment: Environment): Promise<Tag[]> => {
  return (await environment.getTags(undefined)).items.filter(
    (item: Tag) =>
      item.sys.visibility === "public" && item.sys.id.startsWith("market__")
  );
};

const groupBy = <T extends Entry>(
  array: readonly T[],
  field: (t: T) => string,
  extractValue: (t: T) => string
) =>
  array.reduce<{ [key: string]: string[] }>((grouped, value) => {
    if (typeof field === "function") {
      (grouped[field(value)] || (grouped[field(value)] = [])).push(
        extractValue(value)
      );
    }
    return grouped;
  }, {});

const createEntriesInBatch = async (
  chunkPayloads: ResourceEntryPayload[]
): Promise<PromiseSettledResult<Entry>[]> => {
  const entriesToCreate = chunkPayloads.slice(0, CHUNK_SIZE);
  if (entriesToCreate.length === 0) {
    return [];
  }
  const environment = await getEnvironment();
  const promisesOfItems = await entriesToCreate.map(async (payloadItem) => {
    return environment.createEntry("resource", {
      fields: payloadItem.fields,
      metadata: payloadItem.metadata
    });
  });
  await waitFor(TIMEOUT);
  const results = await Promise.allSettled(promisesOfItems);

  return [
    ...results,
    ...(await createEntriesInBatch(chunkPayloads.slice(CHUNK_SIZE)))
  ];
};

const createEntriesAndReturnFulfilledResponse = async (
  allEntryPayloads: ResourceEntryPayload[]
): Promise<PublishEntryPayload[]> => {
  const results: PromiseSettledResult<Entry>[] = await createEntriesInBatch(
    allEntryPayloads
  );

  console.log(
    `Entry creation finished. Created ${results.length} of ${allEntryPayloads.length} entries.`
  );

  const fulfilled = results.filter(({ status }) => status === "fulfilled");

  results
    .filter(({ status }) => status === "rejected")
    .map((entries: any) => {
      console.log(`Failed to upload: ${entries.reason}`);
    });

  console.log(`${fulfilled.length} entries created in contentful.`);

  const response: PublishEntryPayload[] = fulfilled.map(({ value }: any) => ({
    sys: {
      linkType: "Entry",
      type: "Link",
      id: value.sys.id,
      version: value.sys.version
    }
  }));

  return response;
};

const getContentfulMicroCopies = async (
  fetched: Entry[],
  total: number
): Promise<Entry[]> => {
  if (fetched.length === total) {
    return fetched;
  }
  const environment = await getEnvironment();
  const resources = await environment.getEntries({
    content_type: "resource",
    skip: fetched.length,
    limit: KEYS_REQUEST_PAGE_SIZE
  });

  const keys = resources.items.map((resource) => {
    return resource;
  });

  const result = [...fetched, ...keys];

  return getContentfulMicroCopies(result, resources.total);
};

const updateExistingMicrocopies = async (
  entriesToBeProcessed: Entry[],
  locales: Locale[],
  allTags: Tag[]
) => {
  const allLocaleCodes = locales.map((locale) => locale.code);
  const defaultLocale = locales.filter((locale) => locale.default)[0];

  const allEntryPayloads: ResourceEntryPayload[] = entriesToBeProcessed.flatMap(
    (entry) => {
      const keyForLocales = Object.fromEntries(
        allLocaleCodes.map((locale: string) => [
          locale,
          entry.fields.key[defaultLocale.code]
        ])
      );

      const fields = TO_BE_PUBLISHED
        ? {
            key: keyForLocales,
            value: keyForLocales
          }
        : {
            key: keyForLocales
          };

      const tagsToBeApplied = !entry.metadata
        ? allTags
        : allTags.filter(
            ({ sys: { id: tagId } }) =>
              !entry.metadata?.tags.some(({ sys: { id } }) => id === tagId)
          );

      if (IS_CONSOLIDATED) {
        return tagsToBeApplied.map((tagItem) => {
          return {
            metadata: {
              tags: [
                {
                  sys: {
                    type: "Link",
                    linkType: "Tag",
                    id: tagItem.sys.id
                  }
                }
              ]
            },
            fields: fields
          };
        });
      } else {
        return [];
      }
    }
  );

  if (allEntryPayloads.length === 0) {
    return [];
  }

  console.log(
    `${
      allEntryPayloads.length
    } new Micro Copies will be created. Creating them in ${Math.round(
      allEntryPayloads.length / CHUNK_SIZE
    )} chunks...`
  );

  return await createEntriesAndReturnFulfilledResponse(allEntryPayloads);
};

const processNewMicrocopies = async (
  microcopyKeys: string[]
): Promise<PublishEntryPayload[]> => {
  const environment = await getEnvironment();
  const allTags = await getValidMarketTags(environment);
  const allLocales = await environment.getLocales();
  const allLocaleCodes = allLocales.items.map((locale) => locale.code);

  const allTagCodes = allTags.map((tag) => tag.sys.id);

  const allEntryPayloads: ResourceEntryPayload[] = microcopyKeys.flatMap(
    (entry) => {
      const keyForLocales = Object.fromEntries(
        allLocaleCodes.map((locale: string) => [locale, entry])
      );

      const fields = TO_BE_PUBLISHED
        ? {
            key: keyForLocales,
            value: keyForLocales
          }
        : {
            key: keyForLocales
          };

      if (IS_CONSOLIDATED) {
        return allTagCodes.map((tagItem) => {
          return {
            metadata: {
              tags: [
                {
                  sys: {
                    type: "Link",
                    linkType: "Tag",
                    id: tagItem
                  }
                }
              ]
            },
            fields: fields
          };
        });
      } else {
        return {
          fields: fields
        };
      }
    }
  );

  if (allEntryPayloads.length === 0) {
    return [];
  }

  console.log(
    `${
      allEntryPayloads.length
    } new Micro Copies will be created. Creating them in ${Math.round(
      allEntryPayloads.length / CHUNK_SIZE
    )} chunks...`
  );

  return await createEntriesAndReturnFulfilledResponse(allEntryPayloads);
};

const tagExistingContentfulMicrocopies = async (
  contentfulMicrocopies: Entry[]
): Promise<PublishEntryPayload[]> => {
  const environment = await getEnvironment();
  const allTags = await getValidMarketTags(environment);
  console.log(
    `Starting to tag existing microcopies in the environment : ${environment.name}`
  );

  const allLocales = await environment.getLocales();
  const defaultLocale = allLocales.items.filter((locale) => locale.default)[0];

  const allTagCodes = allTags.map((tag: Tag) => tag.sys.id);

  const microCopiesWithoutKeys = contentfulMicrocopies.filter(
    (item) => !item.fields.key || !item.fields.key[defaultLocale.code]
  );
  if (microCopiesWithoutKeys.length > 0) {
    console.log(
      `\nSkipping following micro copies. They do not have Key for default locale : '${defaultLocale.code}'`
    );
    microCopiesWithoutKeys.forEach((item) => {
      console.log(
        `\nMicrocopy Id: '${item.sys.id}' does not have 'Key' populated.`
      );
    });
  }

  let mcToProcess = contentfulMicrocopies.filter(
    (item) => item.fields.key && item.fields.key[defaultLocale.code]
  );
  if (TO_BE_PUBLISHED) {
    mcToProcess = mcToProcess.filter((item) => item.isPublished() === true);
  }
  const groupedMCs = groupBy(
    mcToProcess,
    (item) =>
      item.fields.key && item.fields.key[defaultLocale.code]
        ? item.fields.key[defaultLocale.code]
        : "no_key_mc",
    (item) =>
      !item.metadata || item.metadata.tags.length === 0
        ? "not_tagged"
        : item.metadata.tags[0].sys.id
  );

  const entriesToBeProcessed = mcToProcess.filter(
    (item) =>
      item.fields.key &&
      !allTagCodes.every((code: string) =>
        groupedMCs[item.fields.key[defaultLocale.code]].includes(code)
      )
  );

  if (entriesToBeProcessed.length === 0) {
    console.log(
      `All exsting entries are tagged with ${JSON.stringify(
        allTagCodes
      )}. No further processing required.`
    );
    return [];
  }

  const nodesForExistingMicrocopies = await updateExistingMicrocopies(
    entriesToBeProcessed,
    allLocales.items,
    allTags
  );

  return nodesForExistingMicrocopies;
};

const publishMicroCopies = async (nodes: any) => {
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

const main = async () => {
  const projectKeys = Object.values(microCopy);

  let allContentfulMicrocopies = await await getContentfulMicroCopies([], -1);

  if (TO_BE_PUBLISHED) {
    allContentfulMicrocopies = allContentfulMicrocopies.filter((mc) =>
      mc.isPublished()
    );
  }

  const microCopiesWithMultipleTags = allContentfulMicrocopies.filter(
    (mc) => mc.metadata && mc.metadata.tags.length > 1
  );

  //If there is a microcopy with multiple tags, then stop the process!
  if (microCopiesWithMultipleTags.length > 0) {
    console.error("Following micro copies with multiple tags identified.");
    microCopiesWithMultipleTags.forEach((mc) => {
      console.error(
        `\nContenful id: '${mc.sys.id}' and key: ${JSON.stringify(
          mc.fields.key
        )} has more than one tag: ${JSON.stringify(mc.metadata?.tags)}`
      );
    });
    console.error(`\n`);
    throw Error(
      `Please fix multi tagged entries and start this process again.`
    );
  }

  const contentfulKeys = allContentfulMicrocopies.map((resource) => {
    if (resource.fields.key) {
      return Object.values(resource.fields.key)[0];
    }
  });

  const microCopiesNotInContentful = projectKeys.filter(
    (key) => !contentfulKeys.includes(key)
  );

  const microCopyKeysPresentInContentful = projectKeys.filter((key) =>
    contentfulKeys.includes(key)
  );

  if (microCopiesNotInContentful.length === 0) {
    console.log(
      `All the micrcocopies from project are present in the environment. No brand new microcopies will be created.`
    );
  }

  const environment = await getEnvironment();
  const allTags = await getValidMarketTags(environment);
  // This utility is configured for consolidated but no tags are present
  // hence throw error
  if (IS_CONSOLIDATED && allTags.length === 0) {
    console.log(
      `The environment '${environment.name}' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present.`
    );
    throw Error(
      `Check configuration in CI/CD pipeline for environment: '${environment.name}'`
    );
  }

  let newNodes: any[] = [];
  let nodesForExistingMicrocopies: any[] = [];

  if (microCopiesNotInContentful.length > 0) {
    newNodes = await processNewMicrocopies(microCopiesNotInContentful);
  }

  if (microCopyKeysPresentInContentful.length > 0 && IS_CONSOLIDATED) {
    nodesForExistingMicrocopies = await tagExistingContentfulMicrocopies(
      allContentfulMicrocopies
    );
  }

  if (TO_BE_PUBLISHED) {
    const totalEntriesToPublish = [...newNodes, ...nodesForExistingMicrocopies];
    if (totalEntriesToPublish.length > 0) {
      console.log(`Publishing ${totalEntriesToPublish.length} entries`);
      await publishMicroCopies(totalEntriesToPublish);
    } else {
      console.log(`Nothing to publish`);
    }
  }

  console.log("Done");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

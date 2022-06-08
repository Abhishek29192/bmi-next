import {
  Asset,
  BulkAction,
  BulkActionPublishPayload,
  Entry,
  Environment
} from "contentful-management";
import { copyDefaultValues, findIrrelevantLocales } from "./locale";
import { tagEntity } from "./tag";

// Free tier has an CM API limit of 7 calls per second.
/* istanbul ignore next */
const RATE_LIMIT = (process.env.API_RATE_LIMIT as unknown as number) || 7;
/* istanbul ignore next */
const WAIT_DURATION_MS =
  (process.env.WAIT_DURATION_MS as unknown as number) || 1000;
const MAX_BULK_ITEMS = 200;
const MAX_CONCURRENT_BULK_ACTIONS = 5;

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

async function* fetchAllEntries(
  environment: Environment,
  limit = 100,
  tag?: string
) {
  let offset = 0;
  while (true) {
    const entries = await environment.getEntries({
      skip: offset,
      limit,
      order: "sys.createdAt",
      "sys.archivedVersion[exists]": false,
      ...(tag !== undefined && { "metadata.tags.sys.id[in]": tag })
    });

    if (!entries.items || entries.items.length <= 0) {
      break;
    }
    yield entries;
    offset += entries.limit;
  }
}

async function* fetchAllAssets(
  environment: Environment,
  limit = 100,
  tag?: string
) {
  let offset = 0;
  while (true) {
    const assets = await environment.getAssets({
      skip: offset,
      limit,
      order: "sys.createdAt",
      "sys.archivedVersion[exists]": false,
      ...(tag !== undefined && { "metadata.tags.sys.id[in]": tag })
    });

    if (!assets.items || assets.items.length <= 0) {
      break;
    }
    yield assets;
    offset += assets.limit;
  }
}

export const tagAndUpdate = async (environment: Environment) => {
  const iterators = [fetchAllEntries(environment), fetchAllAssets(environment)];
  for (const iterator of iterators) {
    let itrResult = await iterator.next();
    while (!itrResult.done) {
      const entries = itrResult.value;
      let runs = 0;
      const updatePromises: Promise<Entry | Asset>[] = [];

      for (const entryOrAsset of entries.items) {
        console.log(`Taging item: ${entryOrAsset.sys.id}`);
        tagEntity(entryOrAsset, process.env.DXB_MARKET!);

        console.log(`Updating item: ${entryOrAsset.sys.id}`);
        updatePromises.push(entryOrAsset.update());
        runs++;
        if (runs % RATE_LIMIT == 0) {
          console.log(`Runs: ${runs}. Sleep for 1000ms`);
          await sleep(WAIT_DURATION_MS);
          runs = 0;
        }
      }
      await Promise.all(updatePromises);
      itrResult = await iterator.next();
    }
  }
};

export const publishAll = async (environment: Environment) => {
  const iterators = [
    fetchAllEntries(environment, MAX_BULK_ITEMS),
    fetchAllAssets(environment, MAX_BULK_ITEMS)
  ];

  let runs = 0;
  for (const iterator of iterators) {
    let itrResult = await iterator.next();
    let bullkPublishProgress: BulkAction<BulkActionPublishPayload>[] = [];
    while (!itrResult.done) {
      const entries = itrResult.value;

      const bulkPublishInProgressPromise =
        await environment.createPublishBulkAction({
          entities: {
            items: entries.items.map((item) => {
              if (item.sys.type === "Entry") {
                return {
                  sys: {
                    id: item.sys.id,
                    type: "Link",
                    linkType: "Entry",
                    version: item.sys.version
                  }
                };
              } else {
                return {
                  sys: {
                    id: item.sys.id,
                    type: "Link",
                    linkType: "Asset",
                    version: item.sys.version
                  }
                };
              }
            })
          }
        });
      console.log("Bulk publish action created");

      bullkPublishProgress.push(bulkPublishInProgressPromise);
      runs++;

      console.log(`Current run count is : ${runs}`);
      if (runs % MAX_CONCURRENT_BULK_ACTIONS == 0) {
        await sleep(WAIT_DURATION_MS);

        console.log("Waiting until the bulk actions are completed.");
        console.log(`Promise count ${bullkPublishProgress.length}`);

        const results = await Promise.allSettled(
          bullkPublishProgress.map((p) => p.waitProcessing())
        );
        console.log(`results: ${JSON.stringify(results)}`);

        // reset
        runs = 0;
        bullkPublishProgress = [];
      }

      itrResult = await iterator.next();
    }
  }
};

export const fillDefaultValues = async (
  environment: Environment,
  tag: string,
  marketLocales: string[]
) => {
  const iterators = [
    fetchAllEntries(environment, 100, tag),
    fetchAllAssets(environment, 100, tag)
  ];
  const localesToBePopulated = await findIrrelevantLocales(
    environment,
    marketLocales
  );

  if (!localesToBePopulated || localesToBePopulated.length <= 0) {
    throw new Error("Could not find irrelevant locales");
  }

  console.log(`Populating these locales: ${localesToBePopulated}`);

  for (const iterator of iterators) {
    let itrResult = await iterator.next();
    while (!itrResult.done) {
      const entries = itrResult.value;
      let runs = 0;
      const updatePromises: Promise<boolean>[] = [];

      for (const entryOrAsset of entries.items) {
        console.log(`Adding default values for item: ${entryOrAsset.sys.id}`);
        updatePromises.push(
          copyDefaultValues(
            entryOrAsset,
            localesToBePopulated,
            marketLocales[0]
          )
        );

        runs++;
        if (runs % RATE_LIMIT == 0) {
          console.log(`Runs: ${runs}. Sleep for 1000ms`);
          await sleep(WAIT_DURATION_MS);
          runs = 0;
        }
      }
      const result = await Promise.allSettled(updatePromises);
      console.log(JSON.stringify(result));
      itrResult = await iterator.next();
    }
  }
};

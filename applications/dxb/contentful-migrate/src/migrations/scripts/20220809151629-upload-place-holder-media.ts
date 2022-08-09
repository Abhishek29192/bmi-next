import fs from "fs";
import path from "path";
import { getLocales } from "@bmi-digital/contentful-migration";
import { createClient } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "upload 1x1px file for place holder image";

// create and upload file with known Id
// this is recommneded method and only working method
// for this task, as per CMA documentation
const assetId = "d31e89cb31c3490f881d3f96dc8612d5";

const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  if (!context) {
    return;
  }
  const { accessToken, spaceId, environmentId } = context;

  if (accessToken) {
    const all_Locales = (await getLocales(context.makeRequest)).items.map(
      (localeInfo: any) => {
        return localeInfo.code;
      }
    );
    const imageStream = fs.createReadStream(
      `${path.join(
        __dirname,
        "..",
        "..",
        "..",
        "src",
        "variables",
        "media",
        "1x1.png"
      )}`
    );

    const client = createClient({
      accessToken: accessToken!
    });
    const space = await client.getSpace(spaceId!);
    const environment = await space.getEnvironment(environmentId!);
    const uploadedImage = await environment.createUpload({
      file: imageStream
    });
    await waitFor(100);

    if (uploadedImage && uploadedImage.sys) {
      const all_Titles = all_Locales.reduce(
        (
          prevValue: any,
          currValue: any,
          currIndex: number,
          allLocales: any
        ) => {
          return {
            ...prevValue,
            [all_Locales[currIndex]]: "place-holder-image"
          };
        },
        {}
      );

      const all_Descriptions = all_Locales.reduce(
        (
          prevValue: any,
          currValue: any,
          currIndex: number,
          allLocales: any
        ) => {
          return {
            ...prevValue,
            [all_Locales[currIndex]]: "place-holder-image"
          };
        },
        {}
      );

      const all_Files = all_Locales.reduce(
        (
          prevValue: any,
          currValue: any,
          currIndex: number,
          allLocales: any
        ) => {
          return {
            ...prevValue,
            [all_Locales[currIndex]]: {
              contentType: "image/png",
              fileName: "1x1.png",
              uploadFrom: {
                sys: {
                  type: "Link",
                  linkType: "Upload",
                  id: uploadedImage.sys.id
                }
              }
            }
          };
        },
        {}
      );

      const allLocaleAssetPayloadWithFile = {
        fields: {
          title: {
            ...all_Titles
          },
          description: {
            ...all_Descriptions
          },
          file: {
            ...all_Files
          }
        }
      };
      // Step 2: create asset for all locale while referencing file that was uploaded
      const defaultAssetWithImage = await environment.createAssetWithId(
        assetId,
        allLocaleAssetPayloadWithFile
      );
      // wait is needed for versions to update on server!
      await waitFor(250);
      // Step 2: Process asset for all locales
      defaultAssetWithImage.processForAllLocales();
      // wait is needed for asset process to finish on contentful server!
      await waitFor(2000);
      // Step 3: get latest version of the asset and publish asset.
      await (await environment.getAsset(assetId)).publish();
    }
  }
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  if (!context) {
    return;
  }
  const { accessToken, spaceId, environmentId } = context;
  const client = createClient({
    accessToken: accessToken!
  });
  const space = await client.getSpace(spaceId!);
  const environment = await space.getEnvironment(environmentId!);
  const latestAsset = await environment.getAsset(assetId);
  await (await latestAsset.unpublish()).delete();
};

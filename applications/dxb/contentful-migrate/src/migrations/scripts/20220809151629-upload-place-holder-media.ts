import fs from "fs";
import path from "path";
import { getLocales } from "@bmi-digital/contentful-migration";
import { createClient } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";
import { waitFor } from "../../utils";

export const description = "upload 1x1px file for place holder image";

// create and upload file with known Id
// this is recommneded method and only working method
// for this task, as per CMA documentation
const assetId = "d31e89cb31c3490f881d3f96dc8612d5";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  if (!context) {
    return;
  }
  const { accessToken, spaceId, environmentId } = context;

  if (accessToken) {
    const allLocales = (await getLocales(context.makeRequest)).items.map(
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

    // Step 1: upload 1x1px image to contentful server
    const uploadedImage = await environment.createUpload({
      file: imageStream
    });

    await waitFor(100);

    if (uploadedImage && uploadedImage.sys) {
      const allLocaleTitles = allLocales.reduce(
        (prevValue: any, currValue: any, currIndex: number, locales: any) => {
          return {
            ...prevValue,
            [allLocales[currIndex]]: "place-holder-image"
          };
        },
        {}
      );

      const allLocaleDescriptions = allLocales.reduce(
        (prevValue: any, currValue: any, currIndex: number, locales: any) => {
          return {
            ...prevValue,
            [allLocales[currIndex]]: "place-holder-image"
          };
        },
        {}
      );

      const allLocaleFiles = allLocales.reduce(
        (prevValue: any, currValue: any, currIndex: number, locales: any) => {
          return {
            ...prevValue,
            [allLocales[currIndex]]: {
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
            ...allLocaleTitles
          },
          description: {
            ...allLocaleDescriptions
          },
          file: {
            ...allLocaleFiles
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
      // Step 3: Process asset for all locales
      defaultAssetWithImage.processForAllLocales();
      // wait is needed for asset process to finish on contentful server!
      await waitFor(2000);
      // Step 4: get latest version of the asset and publish asset.
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
  // in case if the 1x1px file is deleted by user ( manually )
  // before this down migration occurs, then this script will fail
  // wrap in try, so that, even if the down migration fails.. the script should not fail
  try {
    const { accessToken, spaceId, environmentId } = context;
    const client = createClient({
      accessToken: accessToken!
    });
    const space = await client.getSpace(spaceId!);
    const environment = await space.getEnvironment(environmentId!);
    const latestAsset = await environment.getAsset(assetId);
    await (await latestAsset.unpublish()).delete();
  } catch (err) {
    console.log(err);
  }
};

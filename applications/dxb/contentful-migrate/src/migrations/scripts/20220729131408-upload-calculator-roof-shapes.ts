import { promises as fs } from "fs";
import { join } from "path";
import { getEnvironment, waitFor } from "@bmi/utils";
import {
  Asset,
  Collection,
  Entry,
  Environment,
  KeyValueMap,
  Locale,
  LocaleProps,
  VersionedLink
} from "contentful-management";
import type { MigrationFunction } from "contentful-migration";

export const description = "Upload WebTool Calculator Roof Shapes";

type LocaleData = Collection<Locale, LocaleProps>;

const ALLOWED_ITEMS_IN_CHUNK = 3;
const DOWN_TIMEOUT = 1000;
const UP_TIMEOUT = 1500;

type RoofShape = {
  id: string;
  name: string;
  imagePath: string;
};

const roofShapes: RoofShape[] = [
  {
    id: "1",
    name: "Roof #1",
    imagePath: "../../images/roof-shapes/roof-1.svg"
  },
  {
    id: "2",
    name: "Roof #2",
    imagePath: "../../images/roof-shapes/roof-2.svg"
  },
  {
    id: "3",
    name: "Roof #3",
    imagePath: "../../images/roof-shapes/roof-3.svg"
  },
  {
    id: "4",
    name: "Roof #4",
    imagePath: "../../images/roof-shapes/roof-4.svg"
  },
  {
    id: "5",
    name: "Roof #5",
    imagePath: "../../images/roof-shapes/roof-5.svg"
  },
  {
    id: "6",
    name: "Roof #6",
    imagePath: "../../images/roof-shapes/roof-6.svg"
  },
  {
    id: "7",
    name: "Roof #7",
    imagePath: "../../images/roof-shapes/roof-7.svg"
  },
  {
    id: "8",
    name: "Roof #8",
    imagePath: "../../images/roof-shapes/roof-8.svg"
  },
  {
    id: "9",
    name: "Roof #9",
    imagePath: "../../images/roof-shapes/roof-9.svg"
  },
  {
    id: "10",
    name: "Roof #10",
    imagePath: "../../images/roof-shapes/roof-10.svg"
  }
];

export const up: MigrationFunction = async () => {
  const environment = await getEnvironment();
  const locales = await environment.getLocales();
  const chunks: RoofShape[][] = [];

  for (let i = 0; i < roofShapes.length; i += ALLOWED_ITEMS_IN_CHUNK) {
    chunks.push(roofShapes.slice(i, i + ALLOWED_ITEMS_IN_CHUNK));
  }

  const promises = chunks.map(async (chunk, index) =>
    uploadData(environment, chunk, locales, index)
  );
  const entries = await Promise.all(promises);

  const fulfilledEntries = entries.flat().map(({ value }) => value);

  if (!fulfilledEntries.length) {
    return;
  }

  const assets: VersionedLink<"Asset">[] = fulfilledEntries.map(
    ({ asset }) => ({
      sys: {
        linkType: "Asset",
        type: "Link",
        id: asset.sys.id,
        version: asset.sys.version
      }
    })
  );

  const roofs: VersionedLink<"Entry">[] = fulfilledEntries.map(
    ({ roofShape }) => ({
      sys: {
        linkType: "Entry",
        type: "Link",
        id: roofShape.sys.id,
        version: roofShape.sys.version
      }
    })
  );

  const assetsBulk = await environment.createPublishBulkAction({
    entities: {
      sys: { type: "Array" },
      items: assets
    }
  });
  await assetsBulk.waitProcessing();

  const roofShapesBulk = await environment.createPublishBulkAction({
    entities: {
      sys: { type: "Array" },
      items: roofs
    }
  });
  await roofShapesBulk.waitProcessing();
};

export const down: MigrationFunction = async () => {
  const environment = await getEnvironment();
  const locales: LocaleData = await environment.getLocales();
  const defaultLocale = locales.items.find(
    (locales) => locales.default
  ) as Locale;
  const entries = await environment.getEntries({
    content_type: "calculatorRoofShape"
  });
  const idsToRemove = roofShapes.map((roofShape) => roofShape.id);

  await Promise.allSettled(
    entries.items.map(async (entry, index) => {
      const mappedFields = getFieldsUnderLocale(
        entry.fields,
        defaultLocale.code
      );

      if (idsToRemove.includes(mappedFields.roofShapeId)) {
        if (index / 2 !== 0) {
          // To avoid requests limitation. We can send up to 10 requests per 1 second
          await waitFor(DOWN_TIMEOUT * (index + 1));
        }
        const asset = await environment.getAsset(mappedFields.media.sys.id);
        await asset.unpublish();
        await asset.delete();
        await entry.unpublish();
        await entry.delete();
      }
    })
  );
};

const uploadData = async (
  env: Environment,
  chunk: RoofShape[],
  locales: LocaleData,
  index: number
) => {
  // To avoid requests limitation. We can send up to 10 requests per 1 second. We use increased timeout, because requests to create Assets take more time, so we need to increase timeout
  await waitFor(UP_TIMEOUT * (index + 1));
  const promises = await Promise.allSettled(
    chunk.map(async (roofShape) => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const file = await fs.readFile(join(__dirname, roofShape.imagePath));
      const asset = await createAsset(env, roofShape, file, locales);

      const roof = await createRoofShapeEntry(env, roofShape, asset, locales);
      return { roofShape: roof, asset };
    })
  );

  return promises.filter(
    ({ status }) => status === "fulfilled"
  ) as PromiseFulfilledResult<{ asset: Asset; roofShape: Entry }>[];
};

const createAsset = async (
  env: Environment,
  roofShape: RoofShape,
  file: Buffer,
  locales: LocaleData
) => {
  const asset = await env.createAssetFromFiles({
    fields: {
      title: getLocalizedValues(locales.items, roofShape.name),
      description: getLocalizedValues(locales.items, roofShape.name),
      file: getLocalizedValues(locales.items, {
        contentType: "image/svg",
        fileName: `${roofShape.name}.svg`,
        file
      })
    }
  });
  return asset.processForAllLocales();
};

const createRoofShapeEntry = async (
  env: Environment,
  roofShape: RoofShape,
  asset: Asset,
  locales: LocaleData
) =>
  env.createEntry("calculatorRoofShape", {
    fields: {
      name: getLocalizedValues(locales.items, roofShape.name),
      roofShapeId: getLocalizedValues(locales.items, roofShape.id),
      media: getLocalizedValues(locales.items, {
        sys: {
          id: asset.sys.id,
          linkType: asset.sys.type,
          type: "Link"
        }
      })
    }
  });

const getLocalizedValues = <T>(locales: Locale[], fields: T) =>
  Object.fromEntries(locales.map((locale) => [locale.code, fields]));

const getFieldsUnderLocale = (fields: KeyValueMap, defaultLocale: string) => {
  const keys = Object.keys(fields);
  return Object.fromEntries(
    keys.map((key) => [key, fields[key][defaultLocale]])
  );
};

import { Asset, Entry, Environment, Locale, Link } from "contentful-management";
import AllLocales from "./resources/locales.json";
import SampleEntry from "./resources/sample_entry.json";
import SampleAsset from "./resources/sample_asset.json";

const findIrrelevantLocales = async (
  environment: Partial<Environment>,
  marketLocales: string[]
) =>
  await (
    await import("../locale")
  ).findIrrelevantLocales(environment as Environment, marketLocales);

const copyDefaultValues = async (
  entry: Partial<Entry | Asset>,
  targetlocales: Locale[],
  sourceLocaleCode: string
) =>
  await (
    await import("../locale")
  ).copyDefaultValues(entry as Entry | Asset, targetlocales, sourceLocaleCode);

const findLocalesFromTag = async (
  entity: Partial<Entry | Asset>,
  marketLocales: { [key: string]: string[] }
) =>
  await (
    await import("../locale")
  ).findLocalesFromTag(entity as Entry | Asset, marketLocales);

const getLocales = jest.fn().mockResolvedValue(AllLocales);
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.getLocales = getLocales;
  return env;
};

const update = jest.fn();
const mockEntry = (): Partial<Entry> => {
  const entry: Partial<Entry> = {};
  entry.metadata = { tags: SampleEntry.metadata.tags as Link<"Tag">[] };
  entry.sys = SampleEntry.sys;
  entry.fields = SampleEntry.fields;
  entry.update = update;
  return entry;
};

const mockAsset = (): Partial<Asset> => {
  const asset: Partial<Asset> = {};
  asset.metadata = { tags: SampleAsset.metadata.tags as Link<"Tag">[] };
  //asset.sys = SampleAsset.sys;
  asset.fields = SampleAsset.fields;
  asset.update = update;
  return asset;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("findIrrelevantLocales", () => {
  it("Returns all locales except the locals belong to the current market", async () => {
    const environment = mockEnvironment();
    const marketLocaleCodes = ["en-GB"];

    const result = await findIrrelevantLocales(environment, marketLocaleCodes);

    expect(result).toHaveLength(2);
    expect(result?.map((l) => l.code)).not.toContain(marketLocaleCodes);
  });
});

describe("copyDefaultValues", () => {
  it("Sets entry default values on all fields under irrelevant locales", async () => {
    const entry = mockEntry();
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");

    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    for (const name in entry.fields) {
      // eslint-disable-next-line security/detect-object-injection
      const field = entry.fields[name];
      targetlocales.forEach((locale) => {
        expect(field[locale.code]).not.toBeUndefined();
        expect(field[locale.code]).not.toBeNull();
      });
    }
  });

  it("Sets asset default values on all fields under irrelevant locales", async () => {
    const asset = mockAsset();
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");

    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      asset,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    for (const name in asset.fields) {
      const typedName = name as keyof typeof asset.fields;
      // eslint-disable-next-line security/detect-object-injection
      const field = asset.fields[typedName];
      if (!field) {
        throw Error("field not found");
      }

      targetlocales.forEach((locale) => {
        expect(field[locale.code]).not.toBeUndefined();
        expect(field[locale.code]).not.toBeNull();
      });
    }
  });

  it("Updates the entry", async () => {
    const entry = mockEntry();
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");

    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    expect(update).toBeCalledTimes(1);
  });

  it("Does not fill in the default values for a field whose source locale value is empty", async () => {
    const entry = mockEntry();
    entry.fields = { name: { "en-GB": "" } };
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");
    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    // eslint-disable-next-line security/detect-object-injection
    const field = entry.fields["name"];
    targetlocales.forEach((locale) => {
      expect(field[locale.code]).toBeUndefined();
    });
  });

  it("Does not try to update if no changes are done", async () => {
    const entry = mockEntry();
    entry.fields = { name: { "en-GB": "" } };
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");
    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    expect(update).toBeCalledTimes(0);
  });
});

describe("findLocalesFromTag", () => {
  it("finds the market's locales", async () => {
    const entry = mockEntry();
    const marketLocales = { uk: ["en-GB"] };

    const result = await findLocalesFromTag(entry, marketLocales);

    expect(result).toEqual(["en-GB"]);
  });

  it("If tag not found, returns undefined", async () => {
    const entry = mockEntry();
    entry.metadata = { tags: [] };
    const marketLocales = { uk: ["en-GB"] };

    const result = await findLocalesFromTag(entry, marketLocales);

    expect(result).toBeUndefined();
  });

  it("If metadata not found, returns undefined", async () => {
    const entry = mockEntry();
    entry.metadata = undefined;
    const marketLocales = { uk: ["en-GB"] };

    const result = await findLocalesFromTag(entry, marketLocales);

    expect(result).toBeUndefined();
  });
});

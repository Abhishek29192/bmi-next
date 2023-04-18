import AllLocales from "./resources/locales.json";
import SampleAsset from "./resources/sample_asset.json";
import SampleEntry from "./resources/sample_entry.json";
import type {
  Asset,
  Entry,
  Environment,
  Link,
  Locale
} from "contentful-management";

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

const getLocales = jest.fn().mockResolvedValue(AllLocales);
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.getLocales = getLocales;
  return env;
};

const update = jest.fn().mockResolvedValue({});
const mockEntry = (entry?: Partial<Entry>): Partial<Entry> => ({
  metadata: { tags: SampleEntry.metadata.tags as Link<"Tag">[] },
  sys: SampleEntry.sys,
  fields: SampleEntry.fields,
  update,
  ...entry
});

const mockAsset = (asset?: Partial<Asset>): Partial<Asset> => ({
  metadata: { tags: SampleAsset.metadata.tags as Link<"Tag">[] },
  fields: SampleAsset.fields,
  update,
  ...asset
});

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
    expect(update).toHaveBeenCalled();
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
    expect(update).toHaveBeenCalled();
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

  it("Does not fill in the default values for a field whose source locale value is undefined", async () => {
    const entry = mockEntry();
    entry.fields = { name: {} };
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
    expect(update).not.toHaveBeenCalled();
  });

  it("Does not try to update if no changes are done", async () => {
    const entry = mockEntry();
    entry.fields = { name: {} };
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");
    const sourceLocaleCode = "en-GB";

    await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    expect(update).toBeCalledTimes(0);
  });

  it("Return false promise if update failes", async () => {
    const entry = mockEntry();
    const targetlocales = AllLocales.items.filter((i) => i.code !== "en-GB");
    const sourceLocaleCode = "en-GB";
    update.mockRejectedValueOnce({});

    const result = await copyDefaultValues(
      entry,
      targetlocales as unknown as Locale[],
      sourceLocaleCode
    );

    expect(result).toBeFalsy();
    expect(update).toHaveBeenCalled();
  });
});

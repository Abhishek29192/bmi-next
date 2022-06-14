import { Asset, Entry, Link } from "contentful-management";
import SampleEntry from "./resources/sample_entry.json";

const findLocalesFromTag = async (
  entity: Partial<Entry | Asset>,
  marketLocales: { [key: string]: string[] }
) =>
  await (
    await import("../locale")
  ).findLocalesFromTag(entity as Entry | Asset, marketLocales);

const update = jest.fn();
const mockEntry = (): Partial<Entry> => {
  const entry: Partial<Entry> = {};
  entry.metadata = { tags: SampleEntry.metadata.tags as Link<"Tag">[] };
  entry.sys = SampleEntry.sys;
  entry.fields = SampleEntry.fields;
  entry.update = update;
  return entry;
};

beforeEach(() => {
  jest.clearAllMocks();
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

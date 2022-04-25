import mockConsole from "jest-mock-console";
import { ContentfulWebhook } from "../types";
import * as mockContentfulWebhook from "./resources/contentfulWebhook.json";
import * as mockContentfulWebhookItaly from "./resources/contentfulWebhook_italy.json";
import * as mockContentfulWebhookCanada from "./resources/contentfulWebhook_canada.json";
import * as mockContentfulWebhookMarketTagNotPresent from "./resources/contentfulWebhook_market_tag_not_present.json";
import * as mockContentfulWebhookMarketMetadataMissing from "./resources/contentfulWebhook_metadata_missing.json";

const findBuildWebhook = async (contentfulWebhook: ContentfulWebhook) =>
  (await import("../find")).FindBuildWebhook(contentfulWebhook);

describe("FindBuildhook", () => {
  beforeEach(() => {
    mockConsole();
  });
  it("returns corresponding build webhook", async () => {
    const res = await findBuildWebhook(mockContentfulWebhook);

    expect(res).not.toBeNull();
  });

  it("returns preview build webhook, if preview variable is set", async () => {
    const previewBuildWebhooks = process.env.PREVIEW_BUILD_WEBHOOKS;
    const IsPreview = process.env.PREVIEW_BUILD;

    process.env.PREVIEW_BUILD_WEBHOOKS =
      '{"norway":"https://norway.preview","italy":"https://italy.preview","finland":"https://finland.preview"}';
    process.env.PREVIEW_BUILD = "true";

    const res = await findBuildWebhook(mockContentfulWebhookItaly);

    expect(res).not.toBeNull();
    expect(res).toEqual("https://italy.preview");

    process.env.PREVIEW_BUILD_WEBHOOKS = previewBuildWebhooks;
    process.env.PREVIEW_BUILD = IsPreview;
  });

  it("returns undefined if webhook's market tag is not recognised", async () => {
    const res = await findBuildWebhook(mockContentfulWebhookCanada);

    expect(res).toBeUndefined();
  });

  it("returns null if webhook's market tag is not present", async () => {
    const res = await findBuildWebhook(
      mockContentfulWebhookMarketTagNotPresent
    );

    expect(res).toBeNull();
  });
  it("returns null, if metadata element is not present in the contentful payload", async () => {
    const res = await findBuildWebhook(
      mockContentfulWebhookMarketMetadataMissing
    );

    expect(res).toBeNull();
  });
});

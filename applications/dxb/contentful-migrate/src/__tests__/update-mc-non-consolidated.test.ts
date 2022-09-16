import { microCopy } from "../../../head/src/constants/microCopies";
import { BULK_SIZE, CHUNK_SIZE } from "../cma/constants";
import {
  getContentfulLocales,
  getContentfulTags,
  getMockContentfulEntries
} from "./cma/helpers";

const envMock = {
  getEntries: jest.fn().mockReturnValue(getMockContentfulEntries([], [])),
  getLocales: jest.fn().mockReturnValue(getContentfulLocales()),
  getTags: jest.fn().mockReturnValue(getContentfulTags()),
  createEntry: jest.fn(() => {
    return Promise.resolve({
      status: "filfilled",
      sys: { id: "mock_id", version: 1 }
    });
  }),
  createPublishBulkAction: jest.fn().mockReturnValue({
    waitProcessing: jest.fn()
  })
};
jest.mock("@bmi/utils", () => {
  return {
    getEnvironment: jest.fn().mockReturnValue(envMock),
    waitFor: jest.fn()
  };
});

const main = async (isToBePublished: boolean, isConsolidated: boolean) =>
  (await import("../cma/update-mc")).main(isToBePublished, isConsolidated);

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  envMock.createEntry = jest.fn(() => {
    return Promise.resolve({
      status: "filfilled",
      sys: { id: "mock_id", version: 1 }
    });
  });
});

describe("main", () => {
  describe("when space does not have any existing entries", () => {
    describe("and `isToBePublished=false`", () => {
      it("should create all project entries and finish with Done message", async () => {
        const projectKeys = Object.values(microCopy);
        const expectedEntries = projectKeys.length;
        const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
        await main(false, false);
        expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
          `${expectedEntries} new Micro Copies will be created. Creating them in ${expectedChunks} chunks...`
        );
        expect((console.log as jest.Mock).mock.calls[1][0]).toEqual(
          `Entry creation finished. Created ${expectedEntries} of ${expectedEntries} entries.`
        );

        expect((console.log as jest.Mock).mock.calls[2][0]).toEqual(
          `${expectedEntries} entries created in contentful.`
        );
        // there was no call to publish and hence no message!
        const publishedMessage = (console.log as jest.Mock).mock.calls.filter(
          (call: string[]) => call[0].endsWith("successfully published")
        );
        expect(publishedMessage).toEqual([]);
        expect(console.log).lastCalledWith("Done");
      });
    });
    describe("and `isToBePublished=true`", () => {
      it("should create all project entries and finish with Published and Done message", async () => {
        const projectKeys = Object.values(microCopy);
        const expectedEntries = projectKeys.length;
        const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
        await main(true, false);
        expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
          `${expectedEntries} new Micro Copies will be created. Creating them in ${expectedChunks} chunks...`
        );
        expect((console.log as jest.Mock).mock.calls[1][0]).toEqual(
          `Entry creation finished. Created ${expectedEntries} of ${expectedEntries} entries.`
        );

        expect((console.log as jest.Mock).mock.calls[2][0]).toEqual(
          `${expectedEntries} entries created in contentful.`
        );
        expect((console.log as jest.Mock).mock.calls[3][0]).toEqual(
          `Publishing ${expectedEntries} entries`
        );
        expect((console.log as jest.Mock).mock.calls[4][0]).toEqual(
          `${BULK_SIZE} successfully published`
        );
        expect((console.log as jest.Mock).mock.calls[6][0]).toEqual(
          `Publish action is complete`
        );

        expect(console.log).lastCalledWith("Done");
      });
    });
    describe("and createEntry Rejects upload", () => {
      it("should log error message and then NO new entry will be created", async () => {
        const rejectErrorObj = {
          status: "rejected",
          reason: "error"
        };
        envMock.createEntry = jest.fn(() => {
          return Promise.reject(rejectErrorObj);
        });

        const projectKeys = Object.values(microCopy);
        const expectedEntries = projectKeys.length;
        const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
        await main(true, false);
        expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
          `${expectedEntries} new Micro Copies will be created. Creating them in ${expectedChunks} chunks...`
        );
        expect((console.log as jest.Mock).mock.calls[1][0]).toEqual(
          `Entry creation finished. Created ${expectedEntries} of ${expectedEntries} entries.`
        );

        expect((console.log as jest.Mock).mock.calls[2][0]).toEqual(
          `Failed to upload: ${JSON.stringify(rejectErrorObj)}`
        );

        // there was no call to publish and hence no message!
        const rejectedEntries = (console.log as jest.Mock).mock.calls.filter(
          (call: string[]) => call[0].startsWith("Failed to upload: ")
        );
        expect(rejectedEntries.length).toEqual(expectedEntries);
        expect(console.log).lastCalledWith("Done");
      });
    });
  });
  describe("when space has some existing microcopy entries", () => {
    it("should create remaining new entries and finish with Done message", async () => {
      const projectKeys = Object.values(microCopy);
      const contentfulEntryKeys = [
        "dialog.close",
        "pdp.overview.sampleDialogMessage"
      ];
      const mockContentfulEntries = getMockContentfulEntries(
        contentfulEntryKeys,
        []
      );
      envMock.getEntries = jest.fn().mockReturnValue(mockContentfulEntries);
      const expectedEntries = projectKeys.length - contentfulEntryKeys.length;
      const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
      await main(true, false);
      expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
        `${expectedEntries} new Micro Copies will be created. Creating them in ${expectedChunks} chunks...`
      );
      expect((console.log as jest.Mock).mock.calls[6][0]).toEqual(
        `Publish action is complete`
      );
      expect(console.log).lastCalledWith("Done");
    });
  });
  describe("when space has ALL existing microcopy entries", () => {
    it("does NOT create any new entries", async () => {
      const projectKeys = Object.values(microCopy);
      const mockContentfulEntries = getMockContentfulEntries(projectKeys, []);
      envMock.getEntries = jest.fn().mockReturnValue(mockContentfulEntries);

      await main(true, false);
      expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
        `All the micrcocopies from project are present in the environment. No brand new microcopies will be created.`
      );
      expect(console.log).lastCalledWith("Done");
    });
  });
});

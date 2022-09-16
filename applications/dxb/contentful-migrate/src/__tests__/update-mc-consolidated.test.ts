import { microCopy } from "../../../head/src/constants/microCopies";
import { BULK_SIZE, CHUNK_SIZE } from "../cma/constants";
import {
  getContentfulLocales,
  getContentfulTags,
  getMockContentfulEntries
} from "./cma/helpers";

const allTags = getContentfulTags();
const allTagIds = allTags.items.map((tag) => tag.sys.id);
const envMock = {
  getEntries: jest.fn().mockReturnValue(getMockContentfulEntries([], [])),
  getLocales: jest.fn().mockReturnValue(getContentfulLocales()),
  getTags: jest.fn().mockReturnValue(allTags),
  createEntry: jest.fn(() => {
    return Promise.resolve({
      status: "filfilled",
      sys: { id: "mock_id", version: 1 }
    });
  }),
  createPublishBulkAction: jest.fn().mockReturnValue({
    waitProcessing: jest.fn()
  }),
  name: "mock-environment"
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
  envMock.getTags = jest.fn().mockReturnValue(allTags);
  envMock.getLocales = jest.fn().mockReturnValue(getContentfulLocales());
});

describe("main", () => {
  describe("when there are no tags defined in the space", () => {
    it("should throw error and log error message", async () => {
      try {
        envMock.getTags = jest.fn().mockReturnValue({ items: [] });
        await main(false, true);
      } catch (ex) {
        expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
          `The environment 'mock-environment' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present.`
        );
        expect((ex as Error).message).toEqual(
          `Check configuration in CI/CD pipeline for environment: '${envMock.name}'`
        );
      }
    });
  });

  describe("when space does not have any existing entries", () => {
    describe("and `isToBePublished=false`", () => {
      it("should create all project entries and finish with Done message", async () => {
        const projectKeys = Object.values(microCopy);
        const mockTagItems = getContentfulTags().items;
        const expectedEntries = projectKeys.length * mockTagItems.length;
        const expectedChunks = Math.round(
          (projectKeys.length / CHUNK_SIZE) * mockTagItems.length
        );

        await main(false, true);
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
    describe("when `isToBePublished=true`", () => {
      it("should create all project entries and finish with Done message", async () => {
        const projectKeys = Object.values(microCopy);
        const expectedEntries = projectKeys.length * allTagIds.length;
        const expectedChunks = Math.round(
          (projectKeys.length / CHUNK_SIZE) * allTagIds.length
        );

        await main(true, true);
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
        expect((console.log as jest.Mock).mock.calls[7][0]).toEqual(
          `Publish action is complete`
        );
        expect(console.log).lastCalledWith("Done");
      });
    });
  });

  describe("when space has some existing microcopy entries", () => {
    describe("and `isToBePublished=true`", () => {
      describe("and ALL contentful entries are in published state", () => {
        describe("and ALL contentful entries are Tagged with ALL markets", () => {
          it("should create remaining new entries and finish with Done message", async () => {
            const projectKeys = Object.values(microCopy);
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntriesWithALLTags = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );
            envMock.getEntries = jest
              .fn()
              .mockReturnValue(mockContentfulEntriesWithALLTags);
            const expectedEntries =
              (projectKeys.length - contentfulEntryKeys.length) *
              allTagIds.length;

            const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
            await main(true, true);
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
              `Starting to tag existing microcopies in the environment : ${envMock.name}`
            );
            expect((console.log as jest.Mock).mock.calls[4][0]).toEqual(
              `All exsting entries are tagged with ${JSON.stringify(
                allTagIds
              )}. No further processing required.`
            );
            expect((console.log as jest.Mock).mock.calls[9][0]).toEqual(
              `Publish action is complete`
            );
            expect(console.log).lastCalledWith("Done");
          });
        });
        describe("and ALL contentful entries are Tagged with SOME markets", () => {
          it("should skip creation of entries which exists in contentful", async () => {
            const projectKeys = Object.values(microCopy);
            const singleTag = allTagIds.slice(0, 1);
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntriesWithALLTags = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );
            const contentfulSingleTagEntryKeys = [
              "documentLibrary.headers.product",
              "documentLibrary.download"
            ];
            const mockContentfulEntriesWithSingleTag = getMockContentfulEntries(
              contentfulSingleTagEntryKeys,
              singleTag,
              jest.fn().mockReturnValue(true)
            );
            envMock.getEntries = jest.fn().mockReturnValue({
              items: [
                ...mockContentfulEntriesWithALLTags.items,
                ...mockContentfulEntriesWithSingleTag.items
              ],
              total:
                mockContentfulEntriesWithALLTags.total +
                mockContentfulEntriesWithSingleTag.total
            });
            const expectedEntries =
              (projectKeys.length -
                contentfulEntryKeys.length -
                contentfulSingleTagEntryKeys.length) *
              allTagIds.length;

            const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
            await main(true, true);
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
              `Starting to tag existing microcopies in the environment : ${envMock.name}`
            );
            expect((console.log as jest.Mock).mock.calls[11][0]).toEqual(
              `Publish action is complete`
            );
            expect(console.log).lastCalledWith("Done");
          });
        });
        describe("and SOME contentful entries are Tagged with MULTIPLE market Tags", () => {
          it("should throw error and log error message", async () => {
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntriesWithALLTags = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );
            mockContentfulEntriesWithALLTags.items[0].metadata.tags.push({
              sys: { id: "market__germany" }
            });
            envMock.getEntries = jest
              .fn()
              .mockReturnValue(mockContentfulEntriesWithALLTags);
            try {
              await main(true, true);
            } catch (ex) {
              expect((console.error as jest.Mock).mock.calls[0][0]).toEqual(
                `Following micro copies with multiple tags identified.`
              );
              expect((ex as Error).message).toEqual(
                "Please fix multi tagged entries and start this process again."
              );
              const msg = `\nContenful id: '${
                mockContentfulEntriesWithALLTags.items[0].sys.id
              }' and key: ${JSON.stringify(
                mockContentfulEntriesWithALLTags.items[0].fields.key
              )} has more than one tag: ${JSON.stringify(
                mockContentfulEntriesWithALLTags.items[0].metadata.tags
              )}`;
              expect((console.error as jest.Mock).mock.calls[1][0]).toEqual(
                msg
              );
            }
          });
        });
        describe("and SOME contentful entries do not have default Locale key value present", () => {
          it("should skip the entries and log message to console and create remaining new entries and finish with Done message", async () => {
            const projectKeys = Object.values(microCopy);
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntriesWithALLTags = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );
            //set the value of the first entry to have error!
            const allLocales = getContentfulLocales();
            allLocales.items[0].code = "de-DE";
            envMock.getLocales = jest.fn().mockReturnValue(allLocales);
            envMock.getEntries = jest
              .fn()
              .mockReturnValue(mockContentfulEntriesWithALLTags);
            const expectedEntries =
              (projectKeys.length - contentfulEntryKeys.length) *
              allTagIds.length;

            const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
            await main(true, true);
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
              `Starting to tag existing microcopies in the environment : ${envMock.name}`
            );
            expect((console.log as jest.Mock).mock.calls[4][0]).toEqual(
              `\nSkipping following micro copies. They do not have Key for default locale : '${allLocales.items[0].code}'`
            );
            expect((console.log as jest.Mock).mock.calls[5][0]).toEqual(
              `\nMicrocopy Id: '${mockContentfulEntriesWithALLTags.items[0].sys.id}' does not have 'Key' populated.`
            );
            expect((console.log as jest.Mock).mock.calls[6][0]).toEqual(
              `\nMicrocopy Id: '${mockContentfulEntriesWithALLTags.items[1].sys.id}' does not have 'Key' populated.`
            );
            expect((console.log as jest.Mock).mock.calls[10][0]).toEqual(
              `Publishing ${expectedEntries} entries`
            );
            expect((console.log as jest.Mock).mock.calls[14][0]).toEqual(
              `Publish action is complete`
            );
            expect(console.log).lastCalledWith("Done");
          });
        });
      });

      describe("and SOME contentful entries are NOT in published state", () => {
        describe("and ALL contentful entries are Tagged with ALL markets", () => {
          it("should skip creation of Published entries of contentful", async () => {
            const projectKeys = Object.values(microCopy);
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntries = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );

            const contentfulDraftEntryKeys = [
              "findARoofer.distanceLabel",
              "findARoofer.certificationLabel"
            ];
            const mockContentfulDraftEntries = getMockContentfulEntries(
              contentfulDraftEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(false)
            );
            envMock.getEntries = jest.fn().mockReturnValue({
              items: [
                ...mockContentfulEntries.items,
                ...mockContentfulDraftEntries.items
              ],
              total:
                mockContentfulEntries.total + mockContentfulDraftEntries.total
            });

            const expectedEntries =
              (projectKeys.length - contentfulEntryKeys.length) *
              allTagIds.length;

            const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
            await main(true, true);
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
              `Starting to tag existing microcopies in the environment : ${envMock.name}`
            );
            expect((console.log as jest.Mock).mock.calls[4][0]).toEqual(
              `All exsting entries are tagged with ${JSON.stringify(
                allTagIds
              )}. No further processing required.`
            );
            expect((console.log as jest.Mock).mock.calls[5][0]).toEqual(
              `Publishing ${expectedEntries} entries`
            );
            expect((console.log as jest.Mock).mock.calls[9][0]).toEqual(
              `Publish action is complete`
            );
            expect(console.log).lastCalledWith("Done");
          });
        });
        describe("and ALL contentful entries are Tagged with SOME markets", () => {
          it("should skip creation of Published entries of contentful", async () => {
            const projectKeys = Object.values(microCopy);
            const singleTagId = allTagIds.slice(0, 1);
            const contentfulEntryKeys = [
              "dialog.close",
              "pdp.overview.sampleDialogMessage"
            ];
            const mockContentfulEntries = getMockContentfulEntries(
              contentfulEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(true)
            );

            const contentfulEntryKeysWithSingleTag = [
              "downloadList.info.message",
              "downloadList.info.title"
            ];
            const mockContentfulEntriesWithSingleTag = getMockContentfulEntries(
              contentfulEntryKeysWithSingleTag,
              singleTagId,
              jest.fn().mockReturnValue(true)
            );

            const contentfulDraftEntryKeys = [
              "findARoofer.distanceLabel",
              "findARoofer.certificationLabel"
            ];
            const mockContentfulDraftEntries = getMockContentfulEntries(
              contentfulDraftEntryKeys,
              allTagIds,
              jest.fn().mockReturnValue(false)
            );
            envMock.getEntries = jest.fn().mockReturnValue({
              items: [
                ...mockContentfulEntries.items,
                ...mockContentfulEntriesWithSingleTag.items,
                ...mockContentfulDraftEntries.items
              ],
              total:
                mockContentfulEntries.total +
                mockContentfulEntriesWithSingleTag.total +
                mockContentfulDraftEntries.total
            });

            const expectedEntries =
              (projectKeys.length -
                contentfulEntryKeys.length -
                contentfulEntryKeysWithSingleTag.length) *
              allTagIds.length;

            const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
            await main(true, true);
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
              `Starting to tag existing microcopies in the environment : ${envMock.name}`
            );

            expect((console.log as jest.Mock).mock.calls[7][0]).toEqual(
              `Publishing ${
                expectedEntries + contentfulEntryKeysWithSingleTag.length
              } entries`
            );
            expect((console.log as jest.Mock).mock.calls[11][0]).toEqual(
              `Publish action is complete`
            );
            expect(console.log).lastCalledWith("Done");
          });
        });
      });
    });
  });

  describe("when space has ALL existing microcopy entries", () => {
    describe("and ALL contentful entries are in published state", () => {
      describe("and ALL contentful entries are Tagged with ALL markets", () => {
        it("should create NO new entries and finish with Done message", async () => {
          const projectKeys = Object.values(microCopy);
          const contentfulEntryKeys = projectKeys;
          const mockContentfulEntries = getMockContentfulEntries(
            contentfulEntryKeys,
            allTagIds,
            jest.fn().mockReturnValue(true)
          );
          envMock.getEntries = jest.fn().mockReturnValue(mockContentfulEntries);

          await main(true, true);
          expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
            `All the micrcocopies from project are present in the environment. No brand new microcopies will be created.`
          );

          expect(console.log).lastCalledWith("Done");
        });
      });
    });
    describe("and ALL contentful entries are NOT in published state", () => {
      describe("and ALL contentful entries are Tagged with ALL markets", () => {
        it("should create new entries and finish with Done message", async () => {
          const projectKeys = Object.values(microCopy);
          const contentfulEntryKeys = ["key-not-in-project"];
          const mockContentfulEntries = getMockContentfulEntries(
            contentfulEntryKeys,
            allTagIds,
            jest.fn().mockReturnValue(false)
          );
          envMock.getEntries = jest.fn().mockReturnValue(mockContentfulEntries);

          await main(true, true);

          const expectedEntries = projectKeys.length * allTagIds.length;

          const expectedChunks = Math.round(expectedEntries / CHUNK_SIZE);
          expect((console.log as jest.Mock).mock.calls[0][0]).toEqual(
            `${expectedEntries} new Micro Copies will be created. Creating them in ${expectedChunks} chunks...`
          );
          expect((console.log as jest.Mock).mock.calls[7][0]).toEqual(
            `Publish action is complete`
          );
          expect(console.log).lastCalledWith("Done");
        });
      });
    });
  });
});
